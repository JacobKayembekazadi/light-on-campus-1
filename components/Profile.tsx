import React from 'react';
import { User } from '../types';
import { MapPin, Calendar, Award } from 'lucide-react';

interface ProfileProps {
  currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  return (
    <div className="max-w-2xl mx-auto">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
           <div className="px-8 pb-8">
               <div className="relative -mt-12 mb-4">
                   <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
               </div>
               
               <div className="flex justify-between items-start mb-6">
                   <div>
                       <h1 className="text-2xl font-bold text-slate-800">{currentUser.name}</h1>
                       <p className="text-slate-500 font-medium capitalize">{currentUser.role}</p>
                   </div>
                   <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                       Edit Profile
                   </button>
               </div>
               
               <div className="flex gap-6 mb-8 text-sm text-slate-600">
                   <div className="flex items-center gap-2">
                       <MapPin size={16} />
                       {currentUser.campus || 'Online Campus'}
                   </div>
                   <div className="flex items-center gap-2">
                       <Calendar size={16} />
                       Joined Oct 2023
                   </div>
               </div>
               
               <div className="border-t border-slate-100 pt-6">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <Award className="text-yellow-500" size={20} />
                       Course Progress
                   </h3>
                   <div className="space-y-4">
                       <div>
                           <div className="flex justify-between text-sm mb-1">
                               <span className="font-medium text-slate-700">Foundations of Faith</span>
                               <span className="text-blue-600 font-bold">80%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }}></div>
                           </div>
                       </div>
                       <div>
                           <div className="flex justify-between text-sm mb-1">
                               <span className="font-medium text-slate-700">Godly Relationships</span>
                               <span className="text-blue-600 font-bold">35%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }}></div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Profile;
