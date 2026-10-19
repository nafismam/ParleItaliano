import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';
import { topicSchema } from '@parle/contracts';

const userSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    name: { type: String, required: true, maxlength: 80 },
    avatarUrl: { type: String, default: null },
    authProvider: { type: String, enum: ['google', 'credentials'], required: true },
    googleSubject: { type: String, select: false },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['learner', 'admin'], default: 'learner', required: true },
    currentLevel: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1'],
      default: 'A1',
      required: true,
    },
    xp: { type: Number, default: 0, min: 0 },
    streakDays: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: Date, default: null },
    disabledAt: { type: Date, default: null },
    sessionVersion: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: 'users', strict: 'throw' },
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.index(
  { googleSubject: 1 },
  { unique: true, partialFilterExpression: { googleSubject: { $type: 'string' } } },
);
userSchema.pre('validate', function () {
  if (
    this.authProvider === 'credentials' &&
    (this.isNew || this.isModified('authProvider') || this.isSelected('passwordHash')) &&
    !this.passwordHash
  )
    this.invalidate('passwordHash', 'Password credentials are required');
  if (
    this.authProvider === 'google' &&
    (this.isNew || this.isModified('authProvider') || this.isSelected('googleSubject')) &&
    !this.googleSubject
  )
    this.invalidate('googleSubject', 'Google subject is required');
});
const ruleSchema = new Schema(
  {
    ruleTitle: { type: String, required: true },
    explanation: { type: String, required: true },
    italianExample: { type: String, required: true },
    englishTranslation: { type: String, required: true },
  },
  { _id: false, strict: 'throw' },
);
const exerciseDocumentSchema = new Schema(
  {
    exerciseId: { type: String, required: true },
    order: { type: Number, required: true, min: 1, max: 5 },
    type: {
      type: String,
      enum: ['multiple_choice', 'fill_in_the_blank', 'sentence_reorder', 'error_correction'],
      required: true,
    },
    prompt: { type: String, required: true },
    options: { type: [String], default: undefined },
    correctAnswer: { type: String, required: true, select: false },
    explanation: { type: String, required: true, select: false },
  },
  { _id: false, strict: 'throw' },
);
const topicDocumentSchema = new Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    cefrLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1'], required: true },
    category: {
      type: String,
      enum: [
        'Verbs',
        'Pronouns',
        'Prepositions',
        'Syntax',
        'Articles',
        'Nouns',
        'Adjectives',
        'Time',
        'Everyday',
      ],
      required: true,
    },
    estimatedMinutes: { type: Number, min: 1, max: 120, required: true },
    theoryMarkdown: { type: String, required: true },
    keyRules: { type: [ruleSchema], required: true },
    exercises: { type: [exerciseDocumentSchema], required: true },
  },
  { timestamps: true, collection: 'topics', strict: 'throw' },
);
topicDocumentSchema.index({ slug: 1 }, { unique: true });
topicDocumentSchema.index({ cefrLevel: 1, category: 1, slug: 1 });
topicDocumentSchema.pre('validate', function () {
  const value = this.toObject();
  const result = topicSchema.safeParse({
    slug: value.slug,
    title: value.title,
    cefrLevel: value.cefrLevel,
    category: value.category,
    estimatedMinutes: value.estimatedMinutes,
    theoryMarkdown: value.theoryMarkdown,
    keyRules: value.keyRules,
    exercises: value.exercises,
  });
  if (!result.success)
    this.invalidate('exercises', result.error.issues.map((issue) => issue.message).join('; '));
});
const exerciseResultSchema = new Schema(
  {
    exerciseId: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    userSubmittedAnswer: { type: String, required: true, maxlength: 1000 },
    timestamp: { type: Date, required: true },
  },
  { _id: false, strict: 'throw' },
);
const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    topicId: { type: Schema.Types.ObjectId, required: true, ref: 'Topic' },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
      required: true,
    },
    score: { type: Number, min: 0, max: 5, default: 0, required: true },
    attempts: { type: Number, min: 0, default: 0, required: true },
    exerciseResults: {
      type: [exerciseResultSchema],
      default: [],
      validate: {
        validator: (value: { exerciseId: string }[]) =>
          value.length <= 5 &&
          new Set(value.map((result) => result.exerciseId)).size === value.length,
        message: 'At most five distinct exercise results are retained',
      },
    },
    completedAt: { type: Date, default: null },
    revision: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: 'user_progress', strict: 'throw' },
);
progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
progressSchema.index({ userId: 1, status: 1, updatedAt: -1 });
progressSchema.pre('validate', function () {
  if (
    this.status === 'completed' &&
    (this.exerciseResults.length !== 5 ||
      this.score !== 5 ||
      this.exerciseResults.some((result) => !result.isCorrect) ||
      !this.completedAt)
  )
    this.invalidate(
      'status',
      'Mastery requires five correct exercise results and a completion date',
    );
});
// Separate bounded attempt documents avoid an unbounded history array on progress.
const attemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    topicId: { type: Schema.Types.ObjectId, required: true },
    attemptId: { type: String, required: true },
    exerciseId: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    answer: { type: String, required: true, maxlength: 1000 },
    xpAwarded: { type: Number, default: 0, min: 0, max: 60 },
    gradingResult: {
      type: new Schema(
        {
          isCorrect: { type: Boolean, required: true },
          correctAnswer: { type: String, required: true },
          explanation: { type: String, required: true },
          xpAwarded: { type: Number, required: true },
        },
        { _id: false, strict: 'throw' },
      ),
      default: undefined,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, collection: 'exercise_attempts', strict: 'throw' },
);
attemptSchema.index({ userId: 1, attemptId: 1 }, { unique: true });
attemptSchema.index({ userId: 1, topicId: 1, createdAt: -1 });
attemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export type UserDocument = InferSchemaType<typeof userSchema>;
export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument> | undefined) ??
  mongoose.model<UserDocument>('User', userSchema);
export const Topic: Model<InferSchemaType<typeof topicDocumentSchema>> =
  (mongoose.models.Topic as Model<InferSchemaType<typeof topicDocumentSchema>> | undefined) ??
  mongoose.model<InferSchemaType<typeof topicDocumentSchema>>('Topic', topicDocumentSchema);
export const UserProgress: Model<InferSchemaType<typeof progressSchema>> =
  (mongoose.models.UserProgress as Model<InferSchemaType<typeof progressSchema>> | undefined) ??
  mongoose.model<InferSchemaType<typeof progressSchema>>('UserProgress', progressSchema);
export const ExerciseAttempt: Model<InferSchemaType<typeof attemptSchema>> =
  (mongoose.models.ExerciseAttempt as Model<InferSchemaType<typeof attemptSchema>> | undefined) ??
  mongoose.model<InferSchemaType<typeof attemptSchema>>('ExerciseAttempt', attemptSchema);
export async function ensureIndexes(): Promise<void> {
  await Promise.all(
    [User, Topic, UserProgress, ExerciseAttempt].map((model) => model.createIndexes()),
  );
}
