import React, { useState } from 'react';
import { User, Enrollment, Course } from '../types';
import { MOCK_ENROLLMENTS, MOCK_COURSES } from '../constants';
import { MapPin, Calendar, Award, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { EditProfileModal, EmptyState } from './ui';
import { ProfileSkeleton } from './ui/SkeletonLoader';

interface ProfileProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdateUser }) => {
  const [user, setUser] = useState<User>(currentUser);
  const [enrollments] = useState<Enrollment[]>(
    MOCK_ENROLLMENTS.filter(e => e.userId === currentUser.id)
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading] = useState(false);

  const handleSaveProfile = (updatedUser: User) => {
    setUser(updatedUser);
    onUpdateUser?.(updatedUser);
  };

  const getCourse = (courseId: string): Course | undefined => {
    return MOCK_COURSES.find(c => c.id === courseId);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-slate-300';
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-6 md:px-8 pb-8">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-500 font-medium capitalize">{user.role.toLowerCase()}</p>
            {user.bio && (
              <p className="text-slate-600 mt-2 text-sm">{user.bio}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              {user.campus || 'Online Campus'}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              Joined {formatDate(user.joinedDate)}
            </div>
            {user.email && (
              <div className="flex items-center gap-2 text-blue-600">
                <span className="text-xs bg-blue-50 px-2 py-1 rounded-full">
                  {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Progress Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
            <Award className="text-yellow-500" size={24} />
            Course Progress
          </h3>

          {enrollments.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses enrolled"
              description="Start learning by enrolling in a course from our Learning Center."
              action={{
                label: 'Browse Courses',
                onClick: () => {}
              }}
            />
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const course = getCourse(enrollment.courseId);
                if (!course) return null;

                return (
                  <div
                    key={enrollment.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {course.title}
                            </h4>
                            <p className="text-xs text-slate-500">{course.instructor}</p>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 flex-shrink-0" />
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {enrollment.completedLessons.length}/{course.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {course.duration}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Progress</span>
                            <span className={`font-bold ${enrollment.progress >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                              {enrollment.progress}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(enrollment.progress)}`}
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Courses', value: enrollments.length, icon: BookOpen },
          { label: 'Completed', value: enrollments.filter(e => e.progress === 100).length, icon: Award },
          { label: 'In Progress', value: enrollments.filter(e => e.progress > 0 && e.progress < 100).length, icon: Clock },
          { label: 'Lessons Done', value: enrollments.reduce((acc, e) => acc + e.completedLessons.length, 0), icon: BookOpen },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-slate-200 text-center"
          >
            <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <stat.icon size={18} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
