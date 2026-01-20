import React, { useState } from 'react';
import { Course, CourseCategory, User, UserRole, Enrollment } from '../types';
import { MOCK_COURSES, MOCK_ENROLLMENTS } from '../constants';
import { Play, Clock, Book, Plus, Sparkles, CheckCircle, BookOpen, ArrowLeft, Users } from 'lucide-react';
import { generateCourseOutline } from '../services/geminiService';
import { EmptyState, ConfirmDialog } from './ui';
import { CourseSkeleton } from './ui/SkeletonLoader';

interface CoursePlatformProps {
  currentUser: User;
}

const CoursePlatform: React.FC<CoursePlatformProps> = ({ currentUser }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(MOCK_ENROLLMENTS);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Creator Mode State
  const [isCreating, setIsCreating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<CourseCategory>(CourseCategory.BIBLE_STUDY);
  const [generatedOutline, setGeneratedOutline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Enrollment dialog state
  const [enrollDialog, setEnrollDialog] = useState<{ isOpen: boolean; course: Course | null }>({ isOpen: false, course: null });

  // Get user's enrollment for a course
  const getUserEnrollment = (courseId: string): Enrollment | undefined => {
    return enrollments.find(e => e.courseId === courseId && e.userId === currentUser.id);
  };

  const handleEnroll = (course: Course) => {
    const existingEnrollment = getUserEnrollment(course.id);
    if (existingEnrollment) {
      setSelectedCourse(course);
      return;
    }
    setEnrollDialog({ isOpen: true, course });
  };

  const confirmEnroll = () => {
    if (!enrollDialog.course) return;

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      courseId: enrollDialog.course.id,
      userId: currentUser.id,
      progress: 0,
      completedLessons: [],
      enrolledAt: Date.now(),
      lastAccessedAt: Date.now()
    };

    setEnrollments([...enrollments, newEnrollment]);
    setEnrollDialog({ isOpen: false, course: null });
    setSelectedCourse(enrollDialog.course);
  };

  const handleLessonComplete = (lessonIndex: number) => {
    if (!selectedCourse) return;

    setEnrollments(prev => prev.map(e => {
      if (e.courseId === selectedCourse.id && e.userId === currentUser.id) {
        const newCompletedLessons = e.completedLessons.includes(lessonIndex)
          ? e.completedLessons.filter(l => l !== lessonIndex)
          : [...e.completedLessons, lessonIndex];
        const progress = Math.round((newCompletedLessons.length / selectedCourse.lessons) * 100);
        return {
          ...e,
          completedLessons: newCompletedLessons,
          progress,
          lastAccessedAt: Date.now()
        };
      }
      return e;
    }));
  };

  const handleGenerateOutline = async () => {
    setIsGenerating(true);
    const outline = await generateCourseOutline(aiTopic, aiCategory);
    setGeneratedOutline(outline);
    setIsGenerating(false);
  };

  const handleSaveCourse = () => {
    if (!generatedOutline) return;
    const newCourse: Course = {
      id: Date.now().toString(),
      title: aiTopic,
      instructor: currentUser.name,
      category: aiCategory,
      description: generatedOutline.slice(0, 100) + '...',
      lessons: 4,
      duration: '4 weeks',
      thumbnail: `https://picsum.photos/seed/${Date.now()}/400/250`,
      content: generatedOutline
    };
    setCourses([...courses, newCourse]);
    setIsCreating(false);
    setGeneratedOutline('');
    setAiTopic('');
  };

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const getEnrollmentStats = () => {
    const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
    return {
      enrolled: userEnrollments.length,
      completed: userEnrollments.filter(e => e.progress === 100).length,
      inProgress: userEnrollments.filter(e => e.progress > 0 && e.progress < 100).length
    };
  };

  // Course Detail View
  if (selectedCourse) {
    const enrollment = getUserEnrollment(selectedCourse.id);
    const isEnrolled = !!enrollment;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-48 md:h-64 bg-slate-900">
          <img
            src={selectedCourse.thumbnail}
            className="w-full h-full object-cover opacity-60"
            alt={selectedCourse.title}
          />
          <button
            onClick={() => setSelectedCourse(null)}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm font-medium flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
              {selectedCourse.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{selectedCourse.title}</h1>
            <p className="text-slate-200 flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span className="font-semibold">{selectedCourse.instructor}</span>
              <span className="text-slate-400">•</span>
              <span>{selectedCourse.duration}</span>
              <span className="text-slate-400">•</span>
              <span>{selectedCourse.lessons} Lessons</span>
            </p>
          </div>
        </div>

        <div className="p-4 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Course Content */}
          <div className="md:col-span-2 space-y-6">
            {isEnrolled && enrollment && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Your Progress</span>
                  <span className="text-sm font-bold text-blue-600">{enrollment.progress}%</span>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {enrollment.completedLessons.length} of {selectedCourse.lessons} lessons completed
                </p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">About this Course</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                {selectedCourse.content ? (
                  <div className="whitespace-pre-line text-sm">{selectedCourse.content}</div>
                ) : (
                  <p>{selectedCourse.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Enrollment Card */}
            {!isEnrolled && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-xl text-white">
                <h3 className="font-bold text-lg mb-2">Start Learning Today</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Enroll now to track your progress and access all course materials.
                </p>
                <button
                  onClick={() => handleEnroll(selectedCourse)}
                  className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                >
                  Enroll Now - Free
                </button>
              </div>
            )}

            {/* Lessons List */}
            <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Course Content</h3>
              <div className="space-y-3">
                {[...Array(selectedCourse.lessons)].map((_, i) => {
                  const isCompleted = enrollment?.completedLessons.includes(i);
                  return (
                    <div
                      key={i}
                      onClick={() => isEnrolled && handleLessonComplete(i)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isEnrolled
                          ? isCompleted
                            ? 'bg-green-50 border-green-200 cursor-pointer'
                            : 'bg-white border-slate-200 hover:border-blue-400 cursor-pointer'
                          : 'bg-slate-100 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isEnrolled
                            ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                            : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? <CheckCircle size={16} /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-slate-700'}`}>
                          Lesson {i + 1}
                        </p>
                        <p className="text-xs text-slate-400">25 mins</p>
                      </div>
                      {isEnrolled && (
                        <Play size={16} className={isCompleted ? 'text-green-500' : 'text-slate-300'} />
                      )}
                    </div>
                  );
                })}
              </div>

              {isEnrolled && (
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors">
                  {enrollment?.progress === 100 ? 'Review Course' : 'Continue Learning'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Creator View
  if (isCreating) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            AI Course Creator
          </h2>
          <button
            onClick={() => setIsCreating(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <Plus className="rotate-45" size={24} />
          </button>
        </div>

        {!generatedOutline ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Topic</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                placeholder="e.g., Finding Peace in Anxiety"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value as CourseCategory)}
              >
                {Object.values(CourseCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerateOutline}
              disabled={isGenerating || !aiTopic}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              {isGenerating ? <Sparkles className="animate-spin" /> : <Sparkles />}
              Generate Outline with Gemini
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm text-slate-700">
              {generatedOutline}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setGeneratedOutline('')}
                className="flex-1 py-3 border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleSaveCourse}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                Publish Course
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Course List View
  const stats = getEnrollmentStats();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Learning Center</h1>
          <p className="text-slate-500">Grow in faith, leadership, and life skills.</p>
        </div>
        {currentUser.role === UserRole.PASTOR && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            <Plus size={20} />
            Create Course
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: 'Enrolled', value: stats.enrolled, icon: BookOpen, color: 'blue' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'yellow' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-3 md:p-4 border border-slate-200">
            <div className={`w-8 h-8 md:w-10 md:h-10 bg-${stat.color}-50 rounded-full flex items-center justify-center mb-2`}>
              <stat.icon size={18} className={`text-${stat.color}-600`} />
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
          }`}
        >
          All Courses
        </button>
        {Object.values(CourseCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <CourseSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCourses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={selectedCategory === 'All'
            ? "No courses are available yet. Check back soon!"
            : `No courses in ${selectedCategory} category.`}
          action={selectedCategory !== 'All' ? {
            label: 'View All Courses',
            onClick: () => setSelectedCategory('All')
          } : undefined}
        />
      )}

      {/* Course Grid */}
      {!isLoading && filteredCourses.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCourses.map((course) => {
            const enrollment = getUserEnrollment(course.id);
            const isEnrolled = !!enrollment;

            return (
              <div
                key={course.id}
                onClick={() => handleEnroll(course)}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all cursor-pointer"
              >
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800">
                    {course.category}
                  </div>
                  {isEnrolled && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle size={12} />
                      {enrollment?.progress === 100 ? 'Completed' : `${enrollment?.progress}%`}
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>

                  {isEnrolled && enrollment && (
                    <div className="mb-4">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Book size={14} />
                      {course.lessons} Lessons
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enrollment Confirmation Dialog */}
      <ConfirmDialog
        isOpen={enrollDialog.isOpen}
        title="Enroll in Course"
        message={`Would you like to enroll in "${enrollDialog.course?.title}"? You'll be able to track your progress and access all course materials.`}
        confirmLabel="Enroll Now"
        cancelLabel="Maybe Later"
        variant="info"
        onConfirm={confirmEnroll}
        onCancel={() => setEnrollDialog({ isOpen: false, course: null })}
      />
    </div>
  );
};

export default CoursePlatform;
