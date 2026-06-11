'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { storage } from '@/lib/storage';
import { Capture, UserProfile } from '@/lib/types';
import SignalLogo from '@/components/SignalLogo';
import CaptureIcon from '@/components/CaptureIcon';

const questions = [
  { key: 'name', label: 'What is your name?', placeholder: 'Hassan', type: 'input', icon: 'user' },
  { key: 'currentWork', label: 'What are you working on right now?', placeholder: 'Building an AI SaaS for content repurposing...', type: 'textarea', icon: 'rocket' },
  { key: 'biggestChallenge', label: 'What problem are you stuck on?', placeholder: 'Scaling Railway deployments, reducing API costs...', type: 'textarea', icon: 'target' },
  { key: 'canOffer', label: 'What can you offer others?', placeholder: 'FastAPI expertise, AI architecture, startup advice...', type: 'textarea', icon: 'bulb' },
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
    name: '', currentWork: '', biggestChallenge: '', canOffer: '',
    conference: 'JSNation / React Summit 2025',
  });

  const current = questions[step];
  const value = profile[current.key as keyof UserProfile];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      storage.setProfile(profile);
      demoCaptures.forEach(c => storage.addCapture(c));
      router.push('/capture');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <SignalLogo size={64} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f1f0ff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            SignalAI
          </h1>
          <p style={{ color: 'rgba(196, 181, 253, 0.7)', fontSize: '15px' }}>
            Turn conference chaos into career capital
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '32px' }}>
          {questions.map((_, i) => (
            <div key={i} className={`dot ${i === step ? 'active' : 'inactive'}`} />
          ))}
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: '28px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div className="icon-box icon-box-purple">
              <CaptureIcon type={current.icon as any} size={22} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'rgba(196, 181, 253, 0.5)', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Step {step + 1} of {questions.length}
              </p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#f1f0ff', marginTop: '2px' }}>
                {current.label}
              </p>
            </div>
          </div>

          {current.type === 'input' ? (
            <Input
              value={value}
              onChange={e => setProfile({ ...profile, [current.key]: String(e.value) })}
              placeholder={current.placeholder}
              style={{ width: '100%', fontSize: '15px' }}
            />
          ) : (
            <TextArea
              value={value}
              onChange={e => setProfile({ ...profile, [current.key]: String(e.value) })}
              placeholder={current.placeholder}
              rows={3}
              style={{ width: '100%', fontSize: '15px' }}
            />
          )}

          <button
            className="btn-neon pulse-glow"
            onClick={handleNext}
            disabled={!value?.trim()}
            style={{ marginTop: '20px' }}
          >
            {step < questions.length - 1 ? 'Next →' : '⚡ Start Capturing'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(167, 139, 250, 0.35)', fontSize: '12px', marginTop: '16px' }}>
          60 seconds setup · {questions.length - step - 1} questions remaining
        </p>
      </div>
    </div>
  );
}