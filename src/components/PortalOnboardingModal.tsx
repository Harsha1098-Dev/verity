import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Heart,
  Compass,
  X,
  Clock,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  UserPortalProfile,
  ManifestationGoal,
  EmotionalState,
  HealingArea,
  AffirmationType,
  EnergyIntention,
  PORTAL_DEFINITIONS,
} from '@/types/portal';
import { PALETTE, FONTS, SHADOWS } from '@/constants/theme';
import { generatePortalAffirmation } from '@/utils/portalEngine';

interface PortalOnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (profile: UserPortalProfile) => void;
  currentProfile: UserPortalProfile;
}

const MANIFESTATION_GOALS: ManifestationGoal[] = [
  'Financial Abundance',
  'Career Growth',
  'Love & Relationships',
  'Marriage',
  'Self Confidence',
  'Physical Health',
  'Emotional Healing',
  'Spiritual Growth',
  'Business Success',
  'Inner Peace',
];

const EMOTIONAL_STATES: EmotionalState[] = [
  'Anxious',
  'Overwhelmed',
  'Motivated',
  'Confident',
  'Lonely',
  'Stressed',
  'Grateful',
  'Hopeful',
];

const HEALING_AREAS: HealingArea[] = [
  'Self-worth',
  'Family',
  'Career',
  'Relationships',
  'Past Trauma',
  'Health',
  'Finances',
];

const AFFIRMATION_TYPES: AffirmationType[] = [
  'Spiritual',
  'Scientific / Mindset',
  'Abundance',
  'Motivational',
  'Self-love',
  'Law of Attraction',
  'Christian',
  'Hindu Spirituality',
  'Universal Energy',
];

const ENERGY_INTENTIONS: EnergyIntention[] = [
  'Attract',
  'Heal',
  'Grow',
  'Release',
  'Transform',
];

export const PortalOnboardingModal: React.FC<PortalOnboardingModalProps> = ({
  visible,
  onClose,
  onComplete,
  currentProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 15;

  const [formData, setFormData] = useState<UserPortalProfile>({
    ...currentProfile,
  });

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
      onClose();
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#0F0C20', '#181236', '#221946']}
        style={styles.container}
      >
        {/* Top Header & Progress */}
        <View style={styles.topBar}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
            <X size={20} color="#D1CDDA" />
          </Pressable>

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
            <Sparkles size={18} color="#F6D6A7" />
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 1: Manifestation Goal */}
          {step === 1 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>SACRED INTENTION</Text>
              <Text style={styles.questionTitle}>
                What are you currently manifesting into reality?
              </Text>
              <Text style={styles.questionSubtitle}>
                Select the core focus you are opening your portal for.
              </Text>

              <View style={styles.optionsList}>
                {MANIFESTATION_GOALS.map((goal) => {
                  const selected = formData.manifestationGoal === goal;
                  return (
                    <Pressable
                      key={goal}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, manifestationGoal: goal });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {goal}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 2: Current Emotion */}
          {step === 2 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>INNER CLIMATE</Text>
              <Text style={styles.questionTitle}>
                How do you feel most days right now?
              </Text>
              <Text style={styles.questionSubtitle}>
                Your portal will meet you exactly where you are to elevate your frequency.
              </Text>

              <View style={styles.optionsGrid}>
                {EMOTIONAL_STATES.map((em) => {
                  const selected = formData.emotionalState === em;
                  return (
                    <Pressable
                      key={em}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, emotionalState: em });
                      }}
                      style={[
                        styles.gridChoiceCard,
                        selected && styles.gridChoiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridChoiceText,
                          selected && styles.gridChoiceTextActive,
                        ]}
                      >
                        {em}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: Healing Area */}
          {step === 3 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>HEALING FIELD</Text>
              <Text style={styles.questionTitle}>
                Which area of life needs the most healing right now?
              </Text>

              <View style={styles.optionsList}>
                {HEALING_AREAS.map((area) => {
                  const selected = formData.healingArea === area;
                  return (
                    <Pressable
                      key={area}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, healingArea: area });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {area}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: Affirmation Resonance */}
          {step === 4 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>SPIRITUAL TRADITION</Text>
              <Text style={styles.questionTitle}>
                What type of affirmations resonate deepest with you?
              </Text>

              <View style={styles.optionsList}>
                {AFFIRMATION_TYPES.map((type) => {
                  const selected = formData.affirmationStyle === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, affirmationStyle: type });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: 90-Day Goal */}
          {step === 5 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>QUANTUM TIMELINE</Text>
              <Text style={styles.questionTitle}>
                What is your biggest specific goal for the next 90 days?
              </Text>
              <Text style={styles.questionSubtitle}>
                Be bold and concrete. E.g. “I want a remote software job” or “₹1 lakh monthly income”.
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  value={formData.goal90Days}
                  onChangeText={(text) =>
                    setFormData({ ...formData, goal90Days: text })
                  }
                  placeholder="Type your 90-day intention here..."
                  placeholderTextColor="#7C778B"
                  multiline
                  numberOfLines={4}
                  style={styles.textInputBox}
                />
              </View>
            </View>
          )}

          {/* STEP 6: Portal Times Checkboxes */}
          {step === 6 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>SYNCHRONICITY GATEWAYS</Text>
              <Text style={styles.questionTitle}>
                Which portal times would you like to receive affirmations?
              </Text>
              <Text style={styles.questionSubtitle}>
                Select the angel numbers that resonate with your spirit.
              </Text>

              <View style={styles.portalTimesGrid}>
                {PORTAL_DEFINITIONS.map((p) => {
                  const isSelected = formData.portalTimes.includes(p.time);
                  return (
                    <Pressable
                      key={p.time}
                      onPress={() => togglePortalTime(p.time)}
                      style={[
                        styles.portalTimeCard,
                        isSelected && styles.portalTimeCardActive,
                      ]}
                    >
                      <View style={styles.portalCardHeader}>
                        <Text
                          style={[
                            styles.portalTimeNum,
                            isSelected && styles.portalTimeNumActive,
                          ]}
                        >
                          {p.display}
                        </Text>
                        {p.isRecommended && (
                          <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedBadgeText}>Sacred</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.portalNameText,
                          isSelected && styles.portalNameTextActive,
                        ]}
                      >
                        {p.name}
                      </Text>
                      <Text style={styles.portalDescText}>{p.theme}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 7: Frequency */}
          {step === 7 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>DELIVERY CADENCE</Text>
              <Text style={styles.questionTitle}>
                How often do you want affirmations delivered?
              </Text>

              <View style={styles.optionsList}>
                {[
                  'Once daily',
                  'Twice daily',
                  'Three times daily',
                  'Every portal time',
                ].map((freq) => {
                  const selected = formData.frequency === freq;
                  return (
                    <Pressable
                      key={freq}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, frequency: freq });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {freq}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 8: Voice */}
          {step === 8 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>AUDIO FREQUENCY</Text>
              <Text style={styles.questionTitle}>
                What is your preferred affirmation voice?
              </Text>

              <View style={styles.optionsList}>
                {[
                  'Female Calm Voice',
                  'Female Spiritual Voice',
                  'Male Deep Voice',
                  'Nature Sounds Only',
                ].map((voice) => {
                  const selected = formData.preferredVoice === voice;
                  return (
                    <Pressable
                      key={voice}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, preferredVoice: voice });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {voice}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 9: Message Length Style */}
          {step === 9 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>AFFIRMATION FORMAT</Text>
              <Text style={styles.questionTitle}>Select your affirmation style</Text>

              <View style={styles.optionsList}>
                {(
                  [
                    'Short (1 line)',
                    'Medium (3 lines)',
                    'Deep Guided Messages',
                  ] as const
                ).map((styleOpt) => {
                  const selected = formData.messageLength === styleOpt;
                  return (
                    <Pressable
                      key={styleOpt}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, messageLength: styleOpt });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {styleOpt}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 10: Personalized AI Affirmations */}
          {step === 10 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>SYNTHETIC INTELLECT</Text>
              <Text style={styles.questionTitle}>
                Do you want AI-generated affirmations customized to your situation?
              </Text>

              <View style={styles.optionsList}>
                {[
                  { label: 'Yes, personalize to my life & goals', val: true },
                  { label: 'No, classic traditional mantras only', val: false },
                ].map((opt) => {
                  const selected = formData.personalizedAI === opt.val;
                  return (
                    <Pressable
                      key={opt.label}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, personalizedAI: opt.val });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 11: Relationship Status */}
          {step === 11 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>LOVE & CONNECTION</Text>
              <Text style={styles.questionTitle}>
                What is your current relationship status?
              </Text>
              <Text style={styles.questionSubtitle}>
                Helps generate aligned love, self-worth, and partnership affirmations.
              </Text>

              <View style={styles.optionsGrid}>
                {['Single', 'Dating', 'Married', 'Complicated'].map((rel) => {
                  const selected = formData.relationshipStatus === rel;
                  return (
                    <Pressable
                      key={rel}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, relationshipStatus: rel });
                      }}
                      style={[
                        styles.gridChoiceCard,
                        selected && styles.gridChoiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridChoiceText,
                          selected && styles.gridChoiceTextActive,
                        ]}
                      >
                        {rel}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 12: Age Group */}
          {step === 12 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>LIFE STAGE</Text>
              <Text style={styles.questionTitle}>What is your age group?</Text>

              <View style={styles.optionsGrid}>
                {['18-24', '25-34', '35-44', '45+'].map((age) => {
                  const selected = formData.ageGroup === age;
                  return (
                    <Pressable
                      key={age}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, ageGroup: age });
                      }}
                      style={[
                        styles.gridChoiceCard,
                        selected && styles.gridChoiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.gridChoiceText,
                          selected && styles.gridChoiceTextActive,
                        ]}
                      >
                        {age}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 13: Energy Intention */}
          {step === 13 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>COSMIC FREQUENCY</Text>
              <Text style={styles.questionTitle}>Choose your primary energy intention</Text>

              <View style={styles.optionsList}>
                {ENERGY_INTENTIONS.map((int) => {
                  const selected = formData.energyIntention === int;
                  return (
                    <Pressable
                      key={int}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, energyIntention: int });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {int}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 14: Income Goal */}
          {step === 14 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>ABUNDANCE MATRIX</Text>
              <Text style={styles.questionTitle}>What is your target income goal?</Text>
              <Text style={styles.questionSubtitle}>
                Generates high-frequency prosperity and wealth declarations.
              </Text>

              <View style={styles.optionsList}>
                {[
                  '₹50,000/month',
                  '₹1 Lakh/month',
                  '₹5 Lakh/month',
                  '₹10 Lakh/month',
                ].map((inc) => {
                  const selected = formData.incomeGoal === inc;
                  return (
                    <Pressable
                      key={inc}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, incomeGoal: inc });
                      }}
                      style={[
                        styles.choiceCard,
                        selected && styles.choiceCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {inc}
                      </Text>
                      {selected && <Check size={18} color="#F6D6A7" />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 15: Confidence Level */}
          {step === 15 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>SELF-MASTERY METER</Text>
              <Text style={styles.questionTitle}>
                Rate your current inner confidence level (1 → 10)
              </Text>
              <Text style={styles.questionSubtitle}>
                Current level: {formData.confidenceLevel}/10
              </Text>

              <View style={styles.confidenceRow}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const selected = formData.confidenceLevel === num;
                  return (
                    <Pressable
                      key={num}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, confidenceLevel: num });
                      }}
                      style={[
                        styles.confidenceCircle,
                        selected && styles.confidenceCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.confidenceNum,
                          selected && styles.confidenceNumActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Live Preview of generated 11:11 Affirmation */}
              <View style={styles.previewBox}>
                <View style={styles.previewHeader}>
                  <Sparkles size={14} color="#F6D6A7" />
                  <Text style={styles.previewTitle}>YOUR 11:11 SAMPLE AFFIRMATION</Text>
                </View>
                <Text style={styles.previewText}>
                  “{generatePortalAffirmation(formData, '11:11').affirmation}”
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation Buttons */}
        <View style={styles.footerRow}>
          {step > 1 ? (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={16} color="#D1CDDA" />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          ) : (
            <View style={{ width: 80 }} />
          )}

          <Pressable onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>
              {step === totalSteps ? 'Activate My Portal' : 'Continue'}
            </Text>
            <ArrowRight size={16} color="#0F0C20" />
          </Pressable>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  closeBtn: {
    padding: 6,
  },
  stepIndicatorGroup: {
    alignItems: 'center',
    gap: 6,
  },
  stepNumberText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: '#D1CDDA',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressBarTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F6D6A7',
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
    paddingBottom: 30,
  },
  stepCard: {
    marginTop: 10,
  },
  questionCategory: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#F6D6A7',
    marginBottom: 6,
  },
  questionTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 24,
    lineHeight: 32,
    color: '#F7F5F2',
    letterSpacing: 0.3,
  },
  questionSubtitle: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: '#A8A2BC',
    marginTop: 6,
    marginBottom: 20,
  },
  optionsList: {
    gap: 10,
    marginTop: 8,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  choiceCardActive: {
    backgroundColor: 'rgba(246, 214, 167, 0.15)',
    borderColor: '#F6D6A7',
  },
  choiceText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    color: '#F7F5F2',
  },
  choiceTextActive: {
    color: '#F6D6A7',
    fontFamily: FONTS.sansSemiBold,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  gridChoiceCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridChoiceCardActive: {
    backgroundColor: 'rgba(246, 214, 167, 0.15)',
    borderColor: '#F6D6A7',
  },
  gridChoiceText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: '#F7F5F2',
  },
  gridChoiceTextActive: {
    color: '#F6D6A7',
    fontFamily: FONTS.sansSemiBold,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    padding: 16,
    marginTop: 10,
  },
  textInputBox: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: '#F7F5F2',
    lineHeight: 22,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  portalTimesGrid: {
    gap: 10,
    marginTop: 8,
  },
  portalTimeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 14,
  },
  portalTimeCardActive: {
    backgroundColor: 'rgba(246, 214, 167, 0.15)',
    borderColor: '#F6D6A7',
  },
  portalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  portalTimeNum: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: '#F7F5F2',
    letterSpacing: 1,
  },
  portalTimeNumActive: {
    color: '#F6D6A7',
  },
  recommendedBadge: {
    backgroundColor: 'rgba(246, 214, 167, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recommendedBadgeText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: '#F6D6A7',
    letterSpacing: 0.5,
  },
  portalNameText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: '#D1CDDA',
    marginTop: 4,
  },
  portalNameTextActive: {
    color: '#F6D6A7',
  },
  portalDescText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: '#A8A2BC',
    marginTop: 2,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 24,
  },
  confidenceCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceCircleActive: {
    backgroundColor: '#F6D6A7',
  },
  confidenceNum: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: '#F7F5F2',
  },
  confidenceNumActive: {
    color: '#0F0C20',
  },
  previewBox: {
    backgroundColor: 'rgba(246, 214, 167, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(246, 214, 167, 0.25)',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  previewTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: '#F6D6A7',
    letterSpacing: 1,
  },
  previewText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: '#F7F5F2',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  backButtonText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: '#D1CDDA',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F6D6A7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: '#0F0C20',
    letterSpacing: 0.5,
  },
});
