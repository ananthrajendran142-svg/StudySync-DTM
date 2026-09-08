import React, { useState } from 'react';
import { Users, Plus, UserPlus, Play, Clock, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function StudySessionsView({ groupSessions, setGroupSessions, onLaunchGroupFocus }) {
  const [subTab, setSubTab] = useState('upcoming');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Form states for session creation
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('Today • 5:00 PM');
  const [maxParticipants, setMaxParticipants] = useState(5);

  // Form state for member invitation
  const [inviteName, setInviteName] = useState('');
  const [inviteRegId, setInviteRegId] = useState('');

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSession = {
      id: Date.now(),
      title,
      subject: subject || 'General Study',
      time,
      participants: 1,
      maxParticipants: Number(maxParticipants),
      members: ['Ananth R (Host)'],
      joined: true,
    };

    setGroupSessions([newSession, ...groupSessions]);
    setTitle('');
    setShowCreateModal(false);
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !selectedSession) return;

    const memberEntry = inviteRegId ? `${inviteName} (${inviteRegId})` : inviteName;

    setGroupSessions(groupSessions.map(s => {
      if (s.id === selectedSession.id) {
        const updatedMembers = [...(s.members || []), memberEntry];
        return {
          ...s,
          members: updatedMembers,
          participants: updatedMembers.length
        };
      }
      return s;
    }));

    setInviteName('');
    setInviteRegId('');
    setShowInviteModal(false);
  };

  const handleToggleJoin = (id) => {
    setGroupSessions(groupSessions.map(s => {
      if (s.id === id) {
        const nextJoined = !s.joined;
        const defaultName = 'Ananth R';
        const membersList = s.members || [];
        const updatedMembers = nextJoined
          ? [...membersList, defaultName]
          : membersList.filter(m => !m.includes(defaultName));

        return {
          ...s,
          joined: nextJoined,
          members: updatedMembers,
          participants: updatedMembers.length
        };
      }
      return s;
    }));
  };

  const openInviteModal = (session) => {
    setSelectedSession(session);
    setShowInviteModal(true);
  };

  const filteredSessions = groupSessions.filter(s => {
    if (subTab === 'my') return s.joined;
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> Study Sessions (Group)
          </h2>
          <p className="text-xs text-slate-500 font-medium">Collaborate, invite peers, and study together in proctored rooms.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl btn-primary-blue font-extrabold text-xs shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Session
        </button>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/80 border border-slate-200">
        <button
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
            subTab === 'upcoming' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming Sessions
        </button>
        <button
          onClick={() => setSubTab('my')}
          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${
            subTab === 'my' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Group Sessions
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="studysync-card p-12 text-center text-slate-400 text-xs border border-slate-200">
            No active group sessions found. Click "Create Session" to form a study group!
          </div>
        ) : (
          filteredSessions.map(session => (
            <div
              key={session.id}
              className="studysync-card p-5 bg-white border border-slate-200 hover:border-blue-300 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-lg">
                    👥
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{session.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {session.time}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-blue-600">
                        <Users className="w-3.5 h-3.5" /> {session.participants}/{session.maxParticipants} Members
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openInviteModal(session)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1"
                    title="Invite Member"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Invite
                  </button>

                  {session.joined ? (
                    <button
                      onClick={() => onLaunchGroupFocus(session)}
                      className="px-4 py-1.5 rounded-xl btn-primary-blue font-bold text-xs flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Launch Focus
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleJoin(session.id)}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Join Room
                    </button>
                  )}
                </div>
              </div>

              {/* Session Roster Roster Badges */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Group Roster:</span>
                {(session.members || ['Ananth R (Host)', 'Dhillip P', 'Suriya K']).map((m, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    👤 {m}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="studysync-card max-w-md w-full rounded-3xl p-6 bg-white border border-blue-200 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900">Create Peer Study Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics Group Study"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Time</label>
                <input
                  type="text"
                  placeholder="e.g. Today • 5:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary-blue text-xs font-bold shadow-md"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="studysync-card max-w-md w-full rounded-3xl p-6 bg-white border border-blue-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Invite Peer to Group Study</h3>
              <button onClick={() => setShowInviteModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shyam Vignesh"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Registration ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. RA2511008020019"
                  value={inviteRegId}
                  onChange={(e) => setInviteRegId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary-blue text-xs font-bold shadow-md"
                >
                  Send Member Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
