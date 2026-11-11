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
import { X, Sparkles, Check, Feather, Heart, Sun } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import { saveJournalEntry } from '@/utils/portalStore';
import { ManifestationJournalEntry } from '@/types/portal';

interface ManifestationJournalModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (entries: ManifestationJournalEntry[]) => void;
  activePortalTime?: string;
}

export const ManifestationJournalModal: React.FC<ManifestationJournalModalProps> = ({
  visible,
  onClose,
  onSaved,
  activePortalTime = '11:11 AM',
}) => {
  const [miracle, setMiracle] = useState<string>('');
  const [grateful, setGrateful] = useState<string>('');
  const [futureSelf, setFutureSelf] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const todayDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    const updated = await saveJournalEntry({
      date: todayDate,
      portalTime: activePortalTime,
      miracleToday: miracle || 'Attuned to peace and synchronized opportunities.',
      gratefulFor: grateful || 'Clarity, health, and expanding abundance.',
      futureSelfMessage: futureSelf || 'You are fully supported and ready for what is next.',
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSaved(updated);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[PALETTE.prosecco.light, '#FFFFFF', PALETTE.paper.linen]}
        style={styles.container}
      >
        {/* Top Header */}
        <View style={styles.topRow}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <X size={22} color={PALETTE.ink.charcoal} />
          </Pressable>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTag}>MANIFESTATION JOURNAL</Text>
            <Text style={styles.headerPortalTime}>{activePortalTime} Gateway</Text>
          </View>

          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Prompt 1: Miracle */}
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <View style={[styles.iconBox, { backgroundColor: PALETTE.prosecco.light }]}>
                <Sparkles size={14} color={PALETTE.bronze.base} />
              </View>
              <Text style={styles.promptLabel}>SACRED SYNCHRONICITY</Text>
            </View>
            <Text style={styles.promptTitle}>What miracle happened today?</Text>
            <Text style={styles.promptHint}>
              Notice unexpected alignments, kind words, sudden breakthroughs, or inner calm.
            </Text>
            <TextInput
              value={miracle}
              onChangeText={setMiracle}
              placeholder="Record today's miracle..."
              placeholderTextColor={PALETTE.ink.subtle}
              multiline
              numberOfLines={3}
              style={styles.inputBox}
            />
          </View>

          {/* Prompt 2: Grateful */}
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <View style={[styles.iconBox, { backgroundColor: PALETTE.deltaMint.light }]}>
                <Heart size={14} color={PALETTE.deltaMint.dark} />
              </View>
              <Text style={styles.promptLabel}>HEART ELEVATION</Text>
            </View>
            <Text style={styles.promptTitle}>What are you deeply grateful for?</Text>
            <Text style={styles.promptHint}>
              Gratitude locks your emotional frequency into immediate abundance.
            </Text>
            <TextInput
              value={grateful}
              onChangeText={setGrateful}
              placeholder="I am grateful for..."
              placeholderTextColor={PALETTE.ink.subtle}
              multiline
              numberOfLines={3}
              style={styles.inputBox}
            />
          </View>

          {/* Prompt 3: Future Self */}
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <View style={[styles.iconBox, { backgroundColor: PALETTE.foggyLove.light }]}>
                <Sun size={14} color={PALETTE.foggyLove.dark} />
              </View>
              <Text style={styles.promptLabel}>FUTURE SELF TRANSMISSION</Text>
            </View>
            <Text style={styles.promptTitle}>What is your future self telling you?</Text>
            <Text style={styles.promptHint}>
              Tune into the version of you who has already manifested the goal. What wisdom do they share?
            </Text>
            <TextInput
              value={futureSelf}
              onChangeText={setFutureSelf}
              placeholder="My future self says..."
              placeholderTextColor={PALETTE.ink.subtle}
              multiline
              numberOfLines={3}
              style={styles.inputBox}
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            style={[styles.saveBtn, isSaved && styles.saveBtnSuccess]}
          >
            {isSaved ? (
              <View style={styles.saveBtnContent}>
                <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.saveBtnTextSuccess}>Journal Sealed to Portal</Text>
              </View>
            ) : (
              <View style={styles.saveBtnContent}>
                <Feather size={16} color={PALETTE.bronze.rich} />
                <Text style={styles.saveBtnText}>Seal In Manifestation</Text>
              </View>
            )}
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.08)',
  },
  closeBtn: {
    padding: 6,
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTag: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: PALETTE.bronze.base,
  },
  headerPortalTime: {
    fontFamily: FONTS.serifBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1,
    color: PALETTE.bronze.base,
  },
  promptTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    lineHeight: 24,
  },
  promptHint: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    color: PALETTE.ink.muted,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 12,
  },
  inputBox: {
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 12,
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
    lineHeight: 20,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: PALETTE.prosecco.base,
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.prosecco.dark,
    marginTop: 10,
    shadowColor: PALETTE.prosecco.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  saveBtnSuccess: {
    backgroundColor: PALETTE.deltaMint.dark,
    borderColor: PALETTE.deltaMint.dark,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: PALETTE.bronze.rich,
    letterSpacing: 0.4,
  },
  saveBtnTextSuccess: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
