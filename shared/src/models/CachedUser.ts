import { Document, model, Schema } from "mongoose";

interface CachedUserDocument extends Document {}

const CachedUserSchema = new Schema({});

export const CachedUser = model<CachedUserDocument>(
	"cachedUsers",
	CachedUserSchema
);
