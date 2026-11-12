import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  X,
  Volume2,
  Clock,
  Layers,
  ShieldAlert,
  Flame,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  UserPortalProfile,
  ManifestationGoal,
  EmotionalState,
  TransformationArea,
  AffirmationStyle,
  EnergyIntention,
  AffirmationFormat,
  NotificationFrequency,
  SACRED_PORTAL_TIMES,
} from '@/types/portal';
import { PALETTE, FONTS } from '@/constants/theme';
import { generateDynamicAffirmation } from '@/utils/portalEngine';

interface PortalOnboardingModalProps {
  visible: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  onComplete: (profile: UserPortalProfile) => void;
  currentProfile: UserPortalProfile;
}

const MANIFESTATION_GOALS: ManifestationGoal[] = [
  'Wealth',
  'Financial Freedom',
  'Career Success',
  'Business Growth',
  'Dream Job',
  'Love',
  'Marriage',
  'Relationships',
  'Self Confidence',
  'Health',
  'Weight Loss',
  'Healing',
  'Happiness',
  'Spiritual Growth',
  'Purpose',
  'Peace',
  'Luxury Lifestyle',
  'Freedom',
];

const EMOTIONAL_STATES: EmotionalState[] = [
  'Anxious',
  'Stressed',
  'Overwhelmed',
  'Lonely',
  'Hopeful',
  'Motivated',
  'Excited',
  'Confident',
];

const TRANSFORMATION_AREAS: TransformationArea[] = [
  'Money',
  'Career',
  'Business',
  'Relationships',
  'Health',
  'Family',
  'Confidence',
  'Emotional Healing',
  'Spiritual Growth',
];

const AFFIRMATION_STYLES: AffirmationStyle[] = [
  'Spiritual',
  'Abundance',
  'Self Love',
  'Motivational',
  'Scientific Mindset',
  'Law of Attraction',
  'Universal Energy',
];

const NOTIFICATION_FREQUENCIES: NotificationFrequency[] = [
  'Once Daily',
  'Twice Daily',
  'Three Times Daily',
  'Every Portal Time',
];

const AFFIRMATION_FORMATS: AffirmationFormat[] = ['Short', 'Medium', 'Deep'];

const ENERGY_INTENTIONS: EnergyIntention[] = [
  'Attract',
  'Heal',
  'Grow',
  'Release',
  'Transform',
  'Expand',
];

const VOICE_TONES = [
  'Calm & Grounding',
  'Celestial & Mystical',
  'Sovereign & Empowering',
  'Gentle Healing',
];

const PRIME_PORTAL_WINDOWS = [
  'Morning Dawn (7:07 AM)',
  'Midday Alignment (11:11 AM)',
  'Afternoon Flow (3:33 PM)',
  'Evening Surrender (9:09 PM)',
  'Midnight Gateway (12:12 AM)',
];

const ATMOSPHERE_CHOICES = [
  'Cosmic Merkaba Stargate',
  'Molten Gold & Obsidian Waves',
  'Amethyst Crystal Sanctuary',
  'Zen Emerald Peak',
  'Obsidian Summit Monolith',
];

const MANIFESTATION_OBSTACLES = [
  'Doubt & Overthinking',
  'Financial Scarcity Fear',
  'Imposter Syndrome',
  'Past Distrust & Guardedness',
  'Energy Fatigue & Burnout',
];

const COMMITMENT_LEVELS = [
  'Daily Sacred Devotion',
  '11-Day Deep Reset',
  '21-Day Neural Rewiring',
  'Sovereign Life Mastery',
];

export const PortalOnboardingModal: React.FC<PortalOnboardingModalProps> = ({
  visible,
  dismissible = false,
  onClose,
  onComplete,
  currentProfile,
}) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 15;

  const [formData, setFormData] = useState<UserPortalProfile>({
    ...currentProfile,
    voiceTone: currentProfile.voiceTone || 'Sovereign & Empowering',
    primePortalWindow: currentProfile.primePortalWindow || 'Midday Alignment (11:11 AM)',
    preferred3DAtmosphere: currentProfile.preferred3DAtmosphere || 'Molten Gold & Obsidian Waves',
    manifestationObstacle: currentProfile.manifestationObstacle || 'Doubt & Overthinking',
    commitmentLevel: currentProfile.commitmentLevel || 'Daily Sacred Devotion',
  });

  useEffect(() => {
    if (visible) {
      setStep(1);
      setFormData({
        ...currentProfile,
        voiceTone: currentProfile.voiceTone || 'Sovereign & Empowering',
        primePortalWindow: currentProfile.primePortalWindow || 'Midday Alignment (11:11 AM)',
        preferred3DAtmosphere: currentProfile.preferred3DAtmosphere || 'Molten Gold & Obsidian Waves',
        manifestationObstacle: currentProfile.manifestationObstacle || 'Doubt & Overthinking',
        commitmentLevel: currentProfile.commitmentLevel || 'Daily Sacred Devotion',
      });
    }
  }, [visible, currentProfile]);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const handleNext = () => {
    triggerHaptic();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onComplete({ ...formData, onboardingCompleted: true });
      if (onClose) onClose();
    }
  };

  const handleBack = () => {
    triggerHaptic();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const togglePortalTime = (time: string) => {
    triggerHaptic();
    setFormData((prev) => {
      const exists = prev.portalTimes.includes(time);
      const updated = exists
        ? prev.portalTimes.filter((t) => t !== time)
        : [...prev.portalTimes, time];
      return { ...prev, portalTimes: updated.length ? updated : [time] };
    });
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  const sampleAffirmation = generateDynamicAffirmation(
    formData,
    formData.goal === 'Career Success' ? 'Career' : 'Wealth',
    '11:11'
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={dismissible && onClose ? onClose : () => {}}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 20 : 16),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        {/* Top Header & Progress */}
        <View style={styles.topBar}>
          {dismissible && onClose ? (
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <X size={20} color={PALETTE.ink.charcoal} />
            </Pressable>
          ) : (
            <View style={{ width: 20 }} />
          )}

          <View style={styles.stepIndicatorGroup}>
            <Text style={styles.stepNumberText}>
              Step {step} of {totalSteps}
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>

          <View style={styles.sparkleIcon}>
            <Sparkles size={18} color={PALETTE.bronze.base} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: What are you currently manifesting? */}
          {step === 1 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 1 • SACRED FOCUS</Text>
              <Text style={styles.questionTitle}>
                What are you currently manifesting?
              </Text>
              <Text style={styles.questionSubtitle}>
                Choose your primary portal focus. All affirmations will anchor into this reality.
              </Text>

              <View style={styles.optionsGrid}>
                {MANIFESTATION_GOALS.map((goal) => {
                  const isSelected = formData.goal === goal;
                  return (
                    <Pressable
                      key={goal}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, goal });
                      }}
                      style={[
                        styles.optionChip,
                        isSelected && styles.optionChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.optionChipTextSelected,
                        ]}
                      >
                        {goal}
                      </Text>
                      {isSelected && (
                        <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 2: How do you feel most days? */}
          {step === 2 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 2 • EMOTIONAL BASELINE</Text>
              <Text style={styles.questionTitle}>
                How do you feel most days?
              </Text>
              <Text style={styles.questionSubtitle}>
                We calibrate affirmations to shift you from your current frequency into emotional certainty.
              </Text>

              <View style={styles.optionsList}>
                {EMOTIONAL_STATES.map((state) => {
                  const isSelected = formData.emotion === state;
                  return (
                    <Pressable
                      key={state}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, emotion: state });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {state}
                      </Text>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: What area of life needs the most transformation? */}
          {step === 3 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 3 • TRANSFORMATION</Text>
              <Text style={styles.questionTitle}>
                What area of life needs the most transformation?
              </Text>
              <Text style={styles.questionSubtitle}>
                Select where you want your next quantum leap to occur.
              </Text>

              <View style={styles.optionsGrid}>
                {TRANSFORMATION_AREAS.map((area) => {
                  const isSelected = formData.transformationArea === area;
                  return (
                    <Pressable
                      key={area}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, transformationArea: area });
                      }}
                      style={[
                        styles.optionChip,
                        isSelected && styles.optionChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.optionChipTextSelected,
                        ]}
                      >
                        {area}
                      </Text>
                      {isSelected && (
                        <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: What affirmation style resonates most? */}
          {step === 4 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 4 • VIBRATIONAL TONE</Text>
              <Text style={styles.questionTitle}>
                What affirmation style resonates most?
              </Text>
              <Text style={styles.questionSubtitle}>
                Attune the language structure to your cognitive and spiritual blueprint.
              </Text>

              <View style={styles.optionsList}>
                {AFFIRMATION_STYLES.map((style) => {
                  const isSelected = formData.affirmationStyle === style;
                  return (
                    <Pressable
                      key={style}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, affirmationStyle: style });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {style}
                      </Text>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: Biggest 90-day goal */}
          {step === 5 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 5 • 90-DAY REALITY TARGET</Text>
              <Text style={styles.questionTitle}>
                Describe your biggest goal in the next 90 days.
              </Text>
              <Text style={styles.questionSubtitle}>
                Be specific. Write as if this milestone is already completed.
              </Text>

              <TextInput
                value={formData.goal90Days}
                onChangeText={(text) =>
                  setFormData({ ...formData, goal90Days: text })
                }
                placeholder="e.g., Lead an exceptional team, earn ₹5 Lakh monthly, and radiate calm confidence"
                placeholderTextColor={PALETTE.ink.muted}
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />

              <View style={styles.quickPromptsRow}>
                <Text style={styles.quickPromptsLabel}>Inspirational starters:</Text>
                {[
                  'Earn ₹5 Lakh monthly in flow',
                  'Attract a loving, committed partner',
                  'Feel boundless health and radiant vitality',
                ].map((prompt) => (
                  <Pressable
                    key={prompt}
                    onPress={() => {
                      triggerHaptic();
                      setFormData({ ...formData, goal90Days: prompt });
                    }}
                    style={styles.promptPill}
                  >
                    <Text style={styles.promptPillText}>+ {prompt}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* STEP 6: Which portal times do you want notifications? */}
          {step === 6 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 6 • PORTAL SYNCHRONICITY</Text>
              <Text style={styles.questionTitle}>
                Which portal times do you want notifications?
              </Text>
              <Text style={styles.questionSubtitle}>
                Select sacred angel number timestamps for spontaneous transmission delivery.
              </Text>

              <View style={styles.portalTimesGrid}>
                {SACRED_PORTAL_TIMES.map((portal) => {
                  const isSelected = formData.portalTimes.includes(portal.time);
                  return (
                    <Pressable
                      key={portal.time}
                      onPress={() => togglePortalTime(portal.time)}
                      style={[
                        styles.portalTimeCard,
                        isSelected && styles.portalTimeCardSelected,
                      ]}
                    >
                      <View style={styles.portalTimeTopRow}>
                        <Zap
                          size={14}
                          color={isSelected ? PALETTE.bronze.base : PALETTE.ink.muted}
                        />
                        <Text
                          style={[
                            styles.portalTimeText,
                            isSelected && styles.portalTimeTextSelected,
                          ]}
                        >
                          {portal.time}
                        </Text>
                      </View>
                      <Text style={styles.portalTimeName}>{portal.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 7: How often do you want affirmations? */}
          {step === 7 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 7 • NOTIFICATION FREQUENCY</Text>
              <Text style={styles.questionTitle}>
                How often do you want affirmations?
              </Text>
              <Text style={styles.questionSubtitle}>
                Choose your ideal cadence for reality alignment.
              </Text>

              <View style={styles.optionsList}>
                {NOTIFICATION_FREQUENCIES.map((freq) => {
                  const isSelected = formData.frequency === freq;
                  return (
                    <Pressable
                      key={freq}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, frequency: freq });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {freq}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={PALETTE.bronze.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 8: Preferred affirmation format */}
          {step === 8 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 8 • TRANSMISSION FORMAT</Text>
              <Text style={styles.questionTitle}>
                Preferred affirmation format?
              </Text>
              <Text style={styles.questionSubtitle}>
                Select length and depth of the delivered sacred statements.
              </Text>

              <View style={styles.formatCardsRow}>
                {AFFIRMATION_FORMATS.map((fmt) => {
                  const isSelected = formData.format === fmt;
                  return (
                    <Pressable
                      key={fmt}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, format: fmt });
                      }}
                      style={[
                        styles.formatCard,
                        isSelected && styles.formatCardSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.formatCardTitle,
                          isSelected && styles.formatCardTitleSelected,
                        ]}
                      >
                        {fmt}
                      </Text>
                      <Text style={styles.formatCardDesc}>
                        {fmt === 'Short'
                          ? '1 sharp, high-impact punch'
                          : fmt === 'Medium'
                          ? '2-3 flowing lines of alignment'
                          : 'Deep guided paragraph'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 9: Energy Intention */}
          {step === 9 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 9 • ENERGY INTENTION</Text>
              <Text style={styles.questionTitle}>
                Choose your energy intention
              </Text>
              <Text style={styles.questionSubtitle}>
                What cosmic verb describes the engine of your current season?
              </Text>

              <View style={styles.optionsGrid}>
                {ENERGY_INTENTIONS.map((intention) => {
                  const isSelected = formData.energy === intention;
                  return (
                    <Pressable
                      key={intention}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, energy: intention });
                      }}
                      style={[
                        styles.optionChip,
                        isSelected && styles.optionChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.optionChipTextSelected,
                        ]}
                      >
                        {intention}
                      </Text>
                      {isSelected && (
                        <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 10: Confidence Level */}
          {step === 10 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 10 • CONFIDENCE LEVEL</Text>
              <Text style={styles.questionTitle}>
                Rate your current confidence level (1 to 10)
              </Text>
              <Text style={styles.questionSubtitle}>
                Tap the score that reflects your current self-belief. We will bridge the rest.
              </Text>

              <View style={styles.sliderPillsGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isSelected = formData.confidence === num;
                  return (
                    <Pressable
                      key={num}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, confidence: num });
                      }}
                      style={[
                        styles.numberPill,
                        isSelected && styles.numberPillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.numberPillText,
                          isSelected && styles.numberPillTextSelected,
                        ]}
                      >
                        {num}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 11: Sacred Voice Tone */}
          {step === 11 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 11 • TRANSMISSION VOICE</Text>
              <Text style={styles.questionTitle}>
                Sacred Voice Tone & Resonance
              </Text>
              <Text style={styles.questionSubtitle}>
                How should the inner voice of the app sound when speaking affirmations?
              </Text>

              <View style={styles.optionsList}>
                {VOICE_TONES.map((tone) => {
                  const isSelected = formData.voiceTone === tone;
                  return (
                    <Pressable
                      key={tone}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, voiceTone: tone });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {tone}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={PALETTE.bronze.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 12: Daily Focus Window */}
          {step === 12 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 12 • PRIME WINDOW</Text>
              <Text style={styles.questionTitle}>
                Daily Prime Manifestation Portal
              </Text>
              <Text style={styles.questionSubtitle}>
                When is your consciousness most receptive to subconscious rewiring?
              </Text>

              <View style={styles.optionsList}>
                {PRIME_PORTAL_WINDOWS.map((window) => {
                  const isSelected = formData.primePortalWindow === window;
                  return (
                    <Pressable
                      key={window}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, primePortalWindow: window });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {window}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={PALETTE.bronze.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 13: Preferred 3D Atmosphere */}
          {step === 13 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 13 • 3D ENVIRONMENT</Text>
              <Text style={styles.questionTitle}>
                Preferred 3D Aesthetic Atmosphere
              </Text>
              <Text style={styles.questionSubtitle}>
                Select the primary 3D visual frequency that anchors your highest self.
              </Text>

              <View style={styles.optionsList}>
                {ATMOSPHERE_CHOICES.map((atm) => {
                  const isSelected = formData.preferred3DAtmosphere === atm;
                  return (
                    <Pressable
                      key={atm}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, preferred3DAtmosphere: atm });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {atm}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={PALETTE.bronze.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 14: Manifestation Obstacle */}
          {step === 14 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 14 • DISSOLVING LIMITS</Text>
              <Text style={styles.questionTitle}>
                Primary Manifestation Obstacle
              </Text>
              <Text style={styles.questionSubtitle}>
                Which subconscious resistance pattern would you like Portal 11:11 to neutralize?
              </Text>

              <View style={styles.optionsList}>
                {MANIFESTATION_OBSTACLES.map((obs) => {
                  const isSelected = formData.manifestationObstacle === obs;
                  return (
                    <Pressable
                      key={obs}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, manifestationObstacle: obs });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {obs}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={PALETTE.bronze.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 15: Commitment Level & Synthesis */}
          {step === 15 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 15 • SOVEREIGN COMMITMENT</Text>
              <Text style={styles.questionTitle}>
                Commitment to Your Highest Reality
              </Text>
              <Text style={styles.questionSubtitle}>
                Declare your dedication to stepping permanently into your desired identity.
              </Text>

              <View style={styles.optionsList}>
                {COMMITMENT_LEVELS.map((com) => {
                  const isSelected = formData.commitmentLevel === com;
                  return (
                    <Pressable
                      key={com}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, commitmentLevel: com });
                      }}
                      style={[
                        styles.fullWidthOption,
                        isSelected && styles.fullWidthOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fullWidthOptionText,
                          isSelected && styles.fullWidthOptionTextSelected,
                        ]}
                      >
                        {com}
                      </Text>
                      {isSelected && (
                        <Check size={16} color={PALETTE.bronze.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Sample Profile Manifestation Preview */}
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Sparkles size={14} color={PALETTE.bronze.base} />
                  <Text style={styles.previewTag}>YOUR PORTAL PROFILE SYNTHESIS</Text>
                </View>
                <Text style={styles.previewAffirmation}>
                  “{sampleAffirmation.text}”
                </Text>
                <Text style={styles.previewMeta}>
                  Delivering to {formData.name} at {formData.portalTimes.join(', ')} • {formData.preferred3DAtmosphere}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation Buttons */}
        <View style={styles.footerRow}>
          {step > 1 ? (
            <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={10}>
              <ArrowLeft size={18} color={PALETTE.ink.muted} />
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <Pressable onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {step === totalSteps ? 'Enter Portal 11:11' : 'Continue'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
  },
  closeBtn: {
    padding: 6,
  },
  stepIndicatorGroup: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  stepNumberText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
    letterSpacing: 1,
  },
  progressBarTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(122, 82, 48, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 2,
  },
  sparkleIcon: {
    padding: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepCard: {
    gap: 16,
  },
  questionCategory: {
    fontFamily: FONTS.sansBold,
    fontSize: 10.5,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
  },
  questionTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 22,
    color: PALETTE.ink.charcoal,
    lineHeight: 30,
  },
  questionSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: PALETTE.ink.muted,
    lineHeight: 19,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
  },
  optionChipSelected: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  optionChipText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12.5,
    color: PALETTE.ink.charcoal,
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  optionsList: {
    gap: 10,
    marginTop: 8,
  },
  fullWidthOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
  },
  fullWidthOptionSelected: {
    borderColor: PALETTE.bronze.base,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  fullWidthOptionText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13.5,
    color: PALETTE.ink.charcoal,
  },
  fullWidthOptionTextSelected: {
    color: PALETTE.bronze.base,
    fontFamily: FONTS.sansBold,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 82, 48, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: PALETTE.bronze.base,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.bronze.base,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONTS.sans,
    fontSize: 13.5,
    color: PALETTE.ink.charcoal,
    textAlignVertical: 'top',
    minHeight: 110,
  },
  quickPromptsRow: {
    gap: 8,
    marginTop: 4,
  },
  quickPromptsLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  promptPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    alignSelf: 'flex-start',
  },
  promptPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.bronze.base,
  },
  portalTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  portalTimeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    padding: 12,
    gap: 4,
  },
  portalTimeCardSelected: {
    borderColor: PALETTE.bronze.base,
    backgroundColor: 'rgba(122, 82, 48, 0.06)',
  },
  portalTimeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  portalTimeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
  },
  portalTimeTextSelected: {
    color: PALETTE.bronze.base,
  },
  portalTimeName: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
  },
  formatCardsRow: {
    gap: 12,
    marginTop: 8,
  },
  formatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    padding: 16,
    gap: 4,
  },
  formatCardSelected: {
    borderColor: PALETTE.bronze.base,
    backgroundColor: 'rgba(122, 82, 48, 0.05)',
  },
  formatCardTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 16,
    color: PALETTE.ink.charcoal,
  },
  formatCardTitleSelected: {
    color: PALETTE.bronze.base,
  },
  formatCardDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  sliderPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 12,
  },
  numberPill: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberPillSelected: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  numberPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: PALETTE.ink.charcoal,
  },
  numberPillTextSelected: {
    color: '#FFFFFF',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    padding: 18,
    gap: 8,
    marginTop: 20,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewTag: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    color: PALETTE.bronze.base,
    letterSpacing: 1.2,
  },
  previewAffirmation: {
    fontFamily: FONTS.serifBold,
    fontSize: 15,
    lineHeight: 22,
    color: PALETTE.ink.charcoal,
  },
  previewMeta: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.12)',
    backgroundColor: PALETTE.paper.linen,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  backBtnText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: PALETTE.ink.muted,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 22,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  nextBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
