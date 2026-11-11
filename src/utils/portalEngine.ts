import { UserPortalProfile, PORTAL_DEFINITIONS } from '@/types/portal';

interface NextPortalResult {
  targetPortalTime: string; // e.g. '2:22 PM'
  portalKey: string; // '2:22'
  hours: number;
  minutes: number;
  seconds: number;
  formattedCountdown: string;
  isPortalActive: boolean; // within 5 min window
  portalTheme: string;
}

/**
 * Calculates the next upcoming portal synchronicity time
 */
export function getNextPortalCountdown(
  portalTimes: string[] = ['11:11', '2:22', '5:55']
): NextPortalResult {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const nowTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  // Convert portal times (e.g. '11:11', '2:22') into 24-hr targets (both AM & PM where sensible)
  const candidateTimes: { key: string; display: string; totalSec: number }[] = [];

  portalTimes.forEach((timeStr) => {
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);

    // AM slot
    candidateTimes.push({
      key: timeStr,
      display: `${timeStr} AM`,
      totalSec: h * 3600 + m * 60,
    });

    // PM slot (if h < 12, also consider PM)
    if (h < 12) {
      candidateTimes.push({
        key: timeStr,
        display: `${timeStr} PM`,
        totalSec: (h + 12) * 3600 + m * 60,
      });
    }
  });

  // Sort candidate times across 24 hours
  candidateTimes.sort((a, b) => a.totalSec - b.totalSec);

  // Check if currently inside a portal window (within 5 minutes)
  for (const c of candidateTimes) {
    const diff = Math.abs(nowTotalSeconds - c.totalSec);
    if (diff <= 300) {
      const def = PORTAL_DEFINITIONS.find((d) => d.time === c.key);
      return {
        targetPortalTime: c.display,
        portalKey: c.key,
        hours: 0,
        minutes: 0,
        seconds: 0,
        formattedCountdown: 'PORTAL OPEN NOW',
        isPortalActive: true,
        portalTheme: def?.theme || 'High synchronicity window open',
      };
    }
  }

  // Find the next upcoming portal
  let next = candidateTimes.find((c) => c.totalSec > nowTotalSeconds);

  // If no more today, pick the first portal tomorrow
  let diffSeconds = 0;
  if (next) {
    diffSeconds = next.totalSec - nowTotalSeconds;
  } else {
    next = candidateTimes[0] || {
      key: '11:11',
      display: '11:11 AM',
      totalSec: 11 * 3600 + 11 * 60,
    };
    diffSeconds = 86400 - nowTotalSeconds + next.totalSec;
  }

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const formattedCountdown = `${String(hours).padStart(2, '0')}h ${String(
    minutes
  ).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  const def = PORTAL_DEFINITIONS.find((d) => d.time === next!.key);

  return {
    targetPortalTime: next.display,
    portalKey: next.key,
    hours,
    minutes,
    seconds,
    formattedCountdown,
    isPortalActive: false,
    portalTheme: def?.theme || 'Divine synchronicity alignment',
  };
}

/**
 * Generates an ultra-personalized AI affirmation based on user profile & portal time
 */
export function generatePortalAffirmation(
  profile: UserPortalProfile,
  portalKey: string = '11:11'
): { headline: string; affirmation: string; portalInsight: string } {
  const name = profile.name || 'Harsha';
  const goal = profile.manifestationGoal || 'Career Growth';
  const emotion = profile.emotionalState || 'Overwhelmed';
  const intention = profile.energyIntention || 'Grow';
  const income = profile.incomeGoal || '₹1 Lakh/month';

  switch (portalKey) {
    case '11:11':
      return {
        headline: `11:11 Awakening • ${name}`,
        affirmation: `${name}, opportunities are aligning for your ${goal.toLowerCase()}. Every conscious action you take today dissolves the feeling of being ${emotion.toLowerCase()} and moves you closer to the divine success you deserve.`,
        portalInsight:
          '11:11 is the cosmic gateway. Your thoughts manifest with double potency during this window.',
      };

    case '2:22':
      return {
        headline: `2:22 Divine Harmony • ${name}`,
        affirmation: `You are divinely supported in your journey toward ${goal.toLowerCase()}. Trust the timing of your ${income} flow—even when immediate proof is hidden, your alignment is taking root.`,
        portalInsight:
          '2:22 represents balance and faith. Keep your energy calm and steady.',
      };

    case '3:33':
      return {
        headline: `3:33 Mind-Body-Soul • ${name}`,
        affirmation: `${name}, your mind, heart, and spirit are locked in sacred coherence. You ${intention.toLowerCase()} abundance effortlessly, and your confidence is blooming into unshakable authority.`,
        portalInsight:
          '3:33 is the trinity portal of wholeness and spiritual mastery.',
      };

    case '4:44':
      return {
        headline: `4:44 Angelic Grounding • ${name}`,
        affirmation: `You are surrounded by protection and guidance. The path to your 90-day breakthrough is clear, secure, and grounded in truth.`,
        portalInsight:
          '4:44 signifies solid foundations and unwavering universal protection.',
      };

    case '5:55':
      return {
        headline: `5:55 Transformation • ${name}`,
        affirmation: `Quantum transformation is happening now. Release doubt and welcome the abundance and ${goal.toLowerCase()} that is already seeking you.`,
        portalInsight:
          '5:55 brings rapid breakthroughs and sudden positive shifts.',
      };

    case '8:08':
      return {
        headline: `8:08 Infinite Wealth • ${name}`,
        affirmation: `${name}, your wealth consciousness is expanding without limit. Financial abundance is your natural state, flowing to you in multiplying waves.`,
        portalInsight:
          '8:08 represents infinite loops of prosperity and sovereign wealth.',
      };

    default:
      return {
        headline: `Portal Alignment • ${name}`,
        affirmation: `${name}, you are the creator of your reality. Your intention to ${intention.toLowerCase()} and master your path is celebrated by the universe today.`,
        portalInsight:
          'Synchronicity arrives when your internal frequency matches your highest desire.',
      };
  }
}
