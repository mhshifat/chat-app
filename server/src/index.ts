import { Loaders } from "./loaders";
import { UserDocument } from './api/modules/users/types';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
      session?: {
        token?: string
      } | null;
    }
  }
}

Loaders.load();