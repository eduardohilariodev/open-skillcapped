import { Content } from "../model/Content";
import { Course } from "../model/Course";
import { Video } from "../model/Video";
import { Commentary } from "../model/Commentary";

export class Parser {
  parse(manifest: any): Content {
    const courses: Course[] = [];
    const videos: Video[] = [];
    const commentaries: Commentary[] = [];

    // Parse courses
    if (manifest.courses) {
      for (const courseData of manifest.courses) {
        const course: Course = {
          id: courseData.id,
          uuid: courseData.id,
          title: courseData.title,
          description: courseData.description || "",
          thumbnailUrl: courseData.thumbnail,
          url: `https://www.skill-capped.com/lol/course/${courseData.id}`,
          videos: [],
          chapters: [],
          releaseDate: new Date(courseData.release_date * 1000)
        };

        // Parse chapters
        if (courseData.chapters) {
          for (const chapterData of courseData.chapters) {
            const chapterVideos: Video[] = [];
            
            // Parse videos in this chapter
            if (chapterData.videos) {
              for (const videoData of chapterData.videos) {
                const video: Video = {
                  id: videoData.id,
                  uuid: videoData.id,
                  title: videoData.title,
                  description: videoData.description || "",
                  thumbnailUrl: videoData.thumbnail,
                  url: `https://www.skill-capped.com/lol/video/${videoData.id}`,
                  releaseDate: new Date(videoData.release_date * 1000),
                  duration: videoData.duration || 0,
                  videoUrl: videoData.video_url || undefined,
                  courseId: courseData.id,
                  chapterId: chapterData.id
                };
                
                chapterVideos.push(video);
                videos.push(video);
                course.videos.push(video);
              }
            }
            
            course.chapters.push({
              id: chapterData.id,
              title: chapterData.title,
              videos: chapterVideos
            });
          }
        }
        
        courses.push(course);
      }
    }

    // Parse commentaries
    if (manifest.commentaries) {
      for (const commentaryData of manifest.commentaries) {
        const commentary: Commentary = {
          id: commentaryData.id,
          uuid: commentaryData.id,
          title: commentaryData.title,
          description: commentaryData.description || "",
          thumbnailUrl: commentaryData.thumbnail,
          url: `https://www.skill-capped.com/lol/video/${commentaryData.id}`,
          releaseDate: new Date(commentaryData.release_date * 1000),
          duration: commentaryData.duration || 0,
          videoUrl: commentaryData.video_url || undefined
        };
        
        commentaries.push(commentary);
      }
    }

    return {
      courses,
      videos,
      commentaries
    };
  }
} 
