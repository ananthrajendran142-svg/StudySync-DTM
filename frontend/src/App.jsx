import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import SplashView from './components/SplashView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import HomeView from './components/HomeView';
import FocusRoom from './components/FocusRoom';
import SmartPlannerView from './components/SmartPlannerView';
import StudySessionsView from './components/StudySessionsView';
import RewardsView from './components/RewardsView';
import ProgressTrackingView from './components/ProgressTrackingView';
import AIAssistantView from './components/AIAssistantView';
import ProfileView from './components/ProfileView';

export default function App() {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('studysync_user');
    return saved ? JSON.parse(saved) : {
      name: 'Ananth R',
      studentId: 'RA2511008020022',
      email: 'ananth@srmist.edu.in',
      department: 'Department of Information Technology',
      studyGoalMins: 120,
      isAuthenticated: true,
      theme: 'light'
    };
  });

  const [activeTab, setActiveTab] = useState(() => {
    return userProfile.isAuthenticated ? 'home' : 'splash';
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('studysync_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [groupSessions, setGroupSessions] = useState(() => {
    const saved = localStorage.getItem('studysync_groups');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Mathematics Group Study', subject: 'Mathematics', time: 'Today • 5:00 PM', participants: 4, maxParticipants: 5, members: ['Ananth R (Host)', 'Dhillip P', 'Suriya K', 'Arunan K'], joined: true },
      { id: 2, title: 'Physics Discussion', subject: 'Physics', time: 'Tomorrow • 3:00 PM', participants: 3, maxParticipants: 5, members: ['Shyam V', 'Amish W', 'Sachin D'], joined: false }
    ];
  });

  const [streak, setStreak] = useState(() => Number(localStorage.getItem('studysync_streak')) || 1);
  const [points, setPoints] = useState(() => Number(localStorage.getItem('studysync_points')) || 0);
  const [totalFocusMins, setTotalFocusMins] = useState(() => Number(localStorage.getItem('studysync_mins')) || 0);
  const [focusSessionsCount, setFocusSessionsCount] = useState(() => Number(localStorage.getItem('studysync_sessions')) || 0);
  const [isProctorActive, setIsProctorActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('studysync_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('studysync_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studysync_groups', JSON.stringify(groupSessions));
  }, [groupSessions]);

  useEffect(() => {
    localStorage.setItem('studysync_streak', streak);
    localStorage.setItem('studysync_points', points);
    localStorage.setItem('studysync_mins', totalFocusMins);
    localStorage.setItem('studysync_sessions', focusSessionsCount);
  }, [streak, points, totalFocusMins, focusSessionsCount]);

  const handleSessionComplete = (sessionType, durationMins) => {
    const gainedPoints = 50;
    setPoints(prev => prev + gainedPoints);
    setTotalFocusMins(prev => prev + durationMins);
    setFocusSessionsCount(prev => prev + 1);
  };

  const handleDistractionDetected = (reason) => {
    setPoints(prev => Math.max(0, prev - 10));
  };

  const handleStartTask = (task) => {
    setCurrentTask(task);
    setActiveTab('timer');
  };

  const handleLaunchGroupFocus = (session) => {
    setCurrentTask({ title: session.title, subject: session.subject });
    setActiveTab('timer');
  };

  const handleLogout = () => {
    setUserProfile(prev => ({ ...prev, isAuthenticated: false }));
    setActiveTab('splash');
  };

  const isDark = userProfile?.theme === 'dark';
  const showHeaderAndFooter = userProfile.isAuthenticated && !['splash', 'login', 'register'].includes(activeTab);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'
    }`}>
      {/* Top Navbar Header */}
      {showHeaderAndFooter && (
        <TopNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'splash' && (
          <SplashView
            onGetStarted={() => setActiveTab('register')}
            onLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'login' && (
          <LoginView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onCompleteLogin={() => setActiveTab('home')}
            onSwitchToRegister={() => setActiveTab('register')}
            onBack={() => setActiveTab('splash')}
          />
        )}

        {activeTab === 'register' && (
          <RegisterView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onCompleteRegister={() => setActiveTab('home')}
            onSwitchToLogin={() => setActiveTab('login')}
            onBack={() => setActiveTab('splash')}
          />
        )}

        {activeTab === 'home' && (
          <HomeView
            userProfile={userProfile}
            tasks={tasks}
            setTasks={setTasks}
            streak={streak}
            focusSessionsCount={focusSessionsCount}
            onStartFocus={() => setActiveTab('timer')}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'timer' && (
          <FocusRoom
            currentTask={currentTask}
            onSessionComplete={handleSessionComplete}
            onDistractionDetected={handleDistractionDetected}
            setIsProctorActive={setIsProctorActive}
          />
        )}

        {activeTab === 'planner' && (
          <SmartPlannerView
            tasks={tasks}
            setTasks={setTasks}
            onStartTask={handleStartTask}
          />
        )}

        {activeTab === 'sessions' && (
          <StudySessionsView
            groupSessions={groupSessions}
            setGroupSessions={setGroupSessions}
            onLaunchGroupFocus={handleLaunchGroupFocus}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsView
            points={points}
            setPoints={setPoints}
            streak={streak}
            stats={{ totalFocusMinutes: totalFocusMins, completedTasks: tasks.filter(t=>t.completed).length }}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'tracking' && (
          <ProgressTrackingView
            totalFocusMins={totalFocusMins}
            tasks={tasks}
          />
        )}

        {activeTab === 'assistant' && (
          <AIAssistantView
            userProfile={userProfile}
            documents={[]}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onLogout={handleLogout}
            onNavigate={setActiveTab}
          />
        )}
      </main>

      {/* Bottom Navbar for Mobile */}
      {showHeaderAndFooter && (
        <BottomNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
