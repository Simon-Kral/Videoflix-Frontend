import { Category } from './category';
import { Video } from './video';

export interface VideoResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Video[];
}
