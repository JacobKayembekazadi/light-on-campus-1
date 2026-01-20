import React, { useState } from 'react';
import { Course, CourseCategory, User, UserRole } from '../types';
import { MOCK_COURSES } from '../constants';
import { Play, Clock, Book, Plus, Sparkles, ChevronRight } from 'lucide-react';
import { generateCourseOutline } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // We don't have this, but standard markdown rendering would go here. I'll simulate it.

interface CoursePlatformProps {
  currentUser: User;
}

const CoursePlatform: React.FC<CoursePlatformProps> = ({ currentUser }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'All'>('All');
  
  // Creator Mode State
  const [isCreating, setIsCreating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<CourseCategory>(CourseCategory.BIBLE_STUDY);
  const [generatedOutline, setGeneratedOutline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  if (selectedCourse) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
        <div className="relative h-64 bg-slate-900">
           <img src={selectedCourse.thumbnail} className="w-full h-full object-cover opacity-60" alt={selectedCourse.title} />
           <button 
             onClick={() => setSelectedCourse(null)}
             className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm font-medium"
           >
             ← Back to Courses
           </button>
           <div className="absolute bottom-0 left-0 p-8 text-white">
             <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                {selectedCourse.category}
             </span>
             <h1 className="text-4xl font-bold mb-2">{selectedCourse.title}</h1>
             <p className="text-slate-200 flex items-center gap-2">
                <span className="font-semibold">{selectedCourse.instructor}</span> • {selectedCourse.duration} • {selectedCourse.lessons} Lessons
             </p>
           </div>
        </div>
        <div className="p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">About this Course</h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                   {selectedCourse.content ? (
                     <div className="whitespace-pre-line">{selectedCourse.content}</div>
                   ) : (
                     <p>{selectedCourse.description}</p>
                   )}
                </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl h-fit border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Course Content</h3>
                <div className="space-y-3">
                    {[...Array(selectedCourse.lessons)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700">Lesson {i + 1}</p>
                                <p className="text-xs text-slate-400">25 mins</p>
                            </div>
                            <Play size={16} className="text-slate-300 group-hover:text-blue-600" />
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors">
                    Start Learning
                </button>
            </div>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden p-8 max-w-2xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                     <Sparkles className="text-purple-600" />
                     AI Course Creator
                 </h2>
                 <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600"><Plus className="rotate-45" size={24}/></button>
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Learning Center</h1>
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

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
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

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            onClick={() => setSelectedCourse(course)}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800">
                    {course.category}
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
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
        ))}
      </div>
    </div>
  );
};

export default CoursePlatform;
