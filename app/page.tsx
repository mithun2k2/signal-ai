'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@progress/kendo-react-buttons';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { storage } from '@/lib/storage';
import { Capture, UserProfile } from '@/lib/types';

const questions = [
  { key: 'name', label: 'What is your name?', placeholder: 'Hassan', type: 'input' },
  { key: 'currentWork', label: 'What are you working on right now?', placeholder: 'Building an AI SaaS for content repurposing...', type: 'textarea' },
  { key: 'biggestChallenge', label: 'What problem are you stuck on?', placeholder: 'Scaling Railway deployments, reducing Claude API costs...', type: 'textarea' },
  { key: 'canOffer', label: 'What can you offer others?', placeholder: 'FastAPI expertise, AI product architecture, startup advice...', type: 'textarea' },
];

const demoCaptures: Capture[] = [
  { id: '1', type: 'slide', content: 'React Server Components reduce bundle size by 60% — move data fetching to server, eliminate client waterfalls', context: 'Ryan Florence keynote', timestamp: Date.now() - 7200000 },
  { id: '2', type: 'contact', content: 'Sarah Chen - DX Engineer at Vercel, working on edge caching, looking for beta users for new analytics tool', context: 'Coffee break networking', timestamp: Date.now() - 5400000 },
  { id: '3', type: 'note', content: 'TanStack Query v5 drops the isLoading split — use isPending instead. Breaking change in migration guide.', context: 'Tanner Linsley talk', timestamp: Date.now() - 3600000 },
  { id: '4', type: 'url', content: 'github.com/epicweb-dev/epic-stack — production-ready full stack template with auth, DB, testing all pre-configured', context: 'Kent C Dodds workshop', timestamp: Date.now() - 1800000 },
  { id: '5', type: 'quote', content: '"Ship the 80% solution today. The perfect version ships never." — audience laughter, but everyone wrote it down', context: 'Addy Osmani closing talk', timestamp: Date.now() - 900000 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    currentWork: '',
    biggestChallenge: '',
    canOffer: '',
    conference: 'JSNation / React Summit 2025',
  });

  const current = questions[step];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      storage.setProfile(profile);
      demoCaptures.forEach(c => storage.addCapture(c));
      router.push('/capture');
    }
  };

  const value = profile[current.key as keyof UserProfile];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-white">SignalAI</h1>
          <p className="text-gray-400 mt-2 text-lg">Turn conference chaos into career capital</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-violet-500 w-8' : 'bg-gray-700 w-2'
              }`}
            />
          ))}
        </div>

        {/* Question card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <label className="block text-lg font-semibold text-white mb-4">
            {current.label}
          </label>

          {current.type === 'input' ? (
            <Input
              value={value}
              onChange={e => setProfile({ ...profile, [current.key]: String(e.value) })}
              placeholder={current.placeholder}
              style={{ width: '100%', fontSize: '16px' }}
            />
          ) : (
            <TextArea
              value={value}
              onChange={e => setProfile({ ...profile, [current.key]: String(e.value) })}
              placeholder={current.placeholder}
              rows={3}
              style={{ width: '100%', fontSize: '16px' }}
            />
          )}

          <Button
            themeColor="primary"
            onClick={handleNext}
            disabled={!value?.trim()}
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              background: '#7c3aed',
              border: 'none',
              borderRadius: '12px',
            }}
          >
            {step < questions.length - 1 ? 'Next →' : 'Start Capturing →'}
          </Button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-4">
          60 seconds setup · {questions.length - step - 1} questions remaining
        </p>
      </div>
    </div>
  );
}