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
  X,
  Clock,
  Sliders,
  Flame,
  Shield,
  Heart,
  Crown,
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
  onClose: () => void;
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

export const PortalOnboardingModal: React.FC<PortalOnboardingModalProps> = ({
  visible,
  onClose,
  onComplete,
  currentProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 10;

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

  const sampleAffirmation = generateDynamicAffirmation(
    formData,
    'Wealth',
    '11:11'
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top Header & Progress */}
        <View style={styles.topBar}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
            <X size={20} color={PALETTE.ink.charcoal} />
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
              <Text style={styles.questionCategory}>STEP 4 • AFFIRMATION TONE</Text>
              <Text style={styles.questionTitle}>
                What affirmation style resonates most?
              </Text>
              <Text style={styles.questionSubtitle}>
                Your brain responds best when words align with your personal belief architecture.
              </Text>

              <View style={styles.optionsList}>
                {AFFIRMATION_STYLES.map((styleItem) => {
                  const isSelected = formData.affirmationStyle === styleItem;
                  return (
                    <Pressable
                      key={styleItem}
                      onPress={() => {
                        triggerHaptic();
                        setFormData({ ...formData, affirmationStyle: styleItem });
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
                        {styleItem}
                      </Text>
                      {isSelected && (
                        <Sparkles size={16} color={PALETTE.gold.base} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: Describe biggest goal in 90 days */}
          {step === 5 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 5 • 90-DAY VISION</Text>
              <Text style={styles.questionTitle}>
                Describe your biggest goal in the next 90 days.
              </Text>
              <Text style={styles.questionSubtitle}>
                Be specific. What reality are you demanding into existence?
              </Text>

              <View style={styles.inputCard}>
                <TextInput
                  value={formData.goal90Days}
                  onChangeText={(text) =>
                    setFormData({ ...formData, goal90Days: text })
                  }
                  placeholder="e.g. Lead an engineering team, earn ₹5 Lakh monthly, and feel peaceful..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={4}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.presetGoalPillsRow}>
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    setFormData({
                      ...formData,
                      goal90Days: 'Lead a software company with ₹10 Lakh monthly cash flow',
                    });
                  }}
                  style={styles.presetGoalPill}
                >
                  <Text style={styles.presetGoalText}>+ ₹10L Monthly Cash Flow</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    triggerHaptic();
                    setFormData({
                      ...formData,
                      goal90Days: 'Attract deep, committed soulmate love & mutual adoration',
                    });
                  }}
                  style={styles.presetGoalPill}
                >
                  <Text style={styles.presetGoalText}>+ Soulmate Love</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* STEP 6: Which portal times do you want notifications? */}
          {step === 6 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 6 • SACRED PORTALS</Text>
              <Text style={styles.questionTitle}>
                Which portal times do you want notifications?
              </Text>
              <Text style={styles.questionSubtitle}>
                Affirmations arrive at high synchronicity times. Tap to select multiple.
              </Text>

              <View style={styles.portalGrid}>
                {SACRED_PORTAL_TIMES.map((portal) => {
                  const isChecked = formData.portalTimes.includes(portal.time);
                  return (
                    <Pressable
                      key={portal.time}
                      onPress={() => togglePortalTime(portal.time)}
                      style={[
                        styles.portalTimeCard,
                        isChecked && styles.portalTimeCardChecked,
                      ]}
                    >
                      <View style={styles.portalTimeTopRow}>
                        <Text
                          style={[
                            styles.portalTimeDigits,
                            isChecked && styles.portalTimeDigitsChecked,
                          ]}
                        >
                          {portal.display}
                        </Text>
                        {portal.isRecommended && (
                          <View style={styles.recommendedPill}>
                            <Text style={styles.recommendedPillText}>REC</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.portalNameText,
                          isChecked && styles.portalNameTextChecked,
                        ]}
                        numberOfLines={1}
                      >
                        {portal.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 7: How often do you want affirmations? */}
          {step === 7 && (
            <View style={styles.stepCard}>
              <Text style={styles.questionCategory}>STEP 7 • FREQUENCY</Text>
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
                        <Check size={16} color={PALETTE.gold.base} />
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
              <Text style={styles.questionCategory}>STEP 8 • FORMAT</Text>
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

          {/* STEP 10: Confidence Level (Slider 1-10) */}
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

              {/* Sample Profile Manifestation Preview */}
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Sparkles size={14} color={PALETTE.gold.base} />
                  <Text style={styles.previewTag}>YOUR PORTAL PROFILE SYNTHESIS</Text>
                </View>
                <Text style={styles.previewAffirmation}>
                  “{sampleAffirmation.text}”
                </Text>
                <Text style={styles.previewMeta}>
                  Delivering to {formData.name} at {formData.portalTimes.join(', ')}
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
            <View style={{ width: 80 }} />
          )}

          <Pressable onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>
              {step === totalSteps ? 'Activate Portal' : 'Continue'}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
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
    paddingTop: Platform.OS === 'ios' ? 20 : 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
  },
  closeBtn: {
    padding: 6,
  },
  stepIndicatorGroup: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  stepNumberText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: PALETTE.bronze.base,
    marginBottom: 6,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(122, 82, 48, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 2,
  },
  sparkleIcon: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  stepCard: {
    gap: 12,
  },
  questionCategory: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: PALETTE.bronze.base,
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
    marginBottom: 8,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  optionChipSelected: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  optionChipText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: PALETTE.ink.body,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  fullWidthOptionSelected: {
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.bronze.base,
  },
  fullWidthOptionText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
  },
  fullWidthOptionTextSelected: {
    color: PALETTE.bronze.rich,
    fontFamily: FONTS.sansBold,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 82, 48, 0.25)',
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
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    padding: 16,
    marginTop: 6,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  textInput: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  presetGoalPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  presetGoalPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
  },
  presetGoalText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.rich,
  },
  portalGrid: {
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
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 12,
  },
  portalTimeCardChecked: {
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.bronze.base,
  },
  portalTimeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portalTimeDigits: {
    fontFamily: FONTS.sansBold,
    fontSize: 16,
    color: PALETTE.ink.charcoal,
  },
  portalTimeDigitsChecked: {
    color: PALETTE.bronze.rich,
  },
  recommendedPill: {
    backgroundColor: PALETTE.prosecco.light,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 8.5,
    color: PALETTE.bronze.rich,
  },
  portalNameText: {
    fontFamily: FONTS.sans,
    fontSize: 10.5,
    color: PALETTE.ink.muted,
    marginTop: 4,
  },
  portalNameTextChecked: {
    color: PALETTE.bronze.base,
  },
  formatCardsRow: {
    gap: 12,
    marginTop: 8,
  },
  formatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  formatCardSelected: {
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.bronze.base,
  },
  formatCardTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 16,
    color: PALETTE.ink.charcoal,
  },
  formatCardTitleSelected: {
    color: PALETTE.bronze.rich,
  },
  formatCardDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
    marginTop: 4,
  },
  sliderPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  numberPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
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
    marginTop: 20,
    backgroundColor: PALETTE.prosecco.light,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  previewTag: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.bronze.base,
    letterSpacing: 1,
  },
  previewAffirmation: {
    fontFamily: FONTS.serifItalic,
    fontSize: 15,
    lineHeight: 22,
    color: PALETTE.ink.charcoal,
  },
  previewMeta: {
    fontFamily: FONTS.sans,
    fontSize: 10.5,
    color: PALETTE.ink.muted,
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
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
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
