import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Plus,
  X,
  Check,
  Calendar,
  Layers,
  Award,
  Zap,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import { VisionBoardItem } from '@/types/portal';
import {
  loadVisionBoard,
  saveVisionBoardItem,
  updateVisionBoardItem,
  DEFAULT_VISION_BOARD,
} from '@/utils/portalStore';

const CATEGORIES: VisionBoardItem['category'][] = [
  'Dream House',
  'Dream Car',
  'Dream Vacation',
  'Income Goals',
  'Health Goals',
  'Relationship Goals',
];

export default function VisionBoardScreen() {
  const [items, setItems] = useState<VisionBoardItem[]>(DEFAULT_VISION_BOARD);
  const [selectedFilter, setSelectedFilter] = useState<'All' | VisionBoardItem['category']>('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // New item state
  const [newCategory, setNewCategory] = useState<VisionBoardItem['category']>('Dream House');
  const [newTitle, setNewTitle] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');

  useEffect(() => {
    (async () => {
      const v = await loadVisionBoard();
      setItems(v);
    })();
  }, []);

  const triggerHaptic = (type: 'light' | 'success' = 'light') => {
    if (Platform.OS !== 'web') {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleToggleStatus = async (item: VisionBoardItem) => {
    triggerHaptic('success');
    const nextStatus =
      item.status === 'Manifesting'
        ? 'In Flow'
        : item.status === 'In Flow'
        ? 'Manifested'
        : 'Manifesting';

    const updated = await updateVisionBoardItem(item.id, {
      status: nextStatus,
    });
    setItems(updated);
  };

  const handleAddItem = async () => {
    if (!newTitle.trim()) return;
    triggerHaptic('success');

    const updated = await saveVisionBoardItem({
      category: newCategory,
      title: newTitle,
      intention: newIntention || 'Embodying this reality with quiet conviction.',
      targetDate: newTargetDate || 'Dec 2027',
      status: 'In Flow',
      gradientColors:
        newCategory === 'Income Goals'
          ? ['#2F1F05', '#160E02']
          : newCategory === 'Dream House'
          ? ['#38184C', '#1D0D2A']
          : ['#0C1E3A', '#061021'],
    });

    setItems(updated);
    setNewTitle('');
    setNewIntention('');
    setNewTargetDate('');
    setIsAddModalVisible(false);
  };

  const filteredItems =
    selectedFilter === 'All'
      ? items
      : items.filter((item) => item.category === selectedFilter);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>VISION BOARD MATRIX</Text>
            <Text style={styles.headerSubtitle}>
              Quantum Anchoring of Your Future Reality
            </Text>
          </View>

          <Pressable
            onPress={() => {
              triggerHaptic('light');
              setIsAddModalVisible(true);
            }}
            style={styles.addBtn}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Vision</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <Pressable
            onPress={() => {
              triggerHaptic('light');
              setSelectedFilter('All');
            }}
            style={[
              styles.filterPill,
              selectedFilter === 'All' && styles.filterPillSelected,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'All' && styles.filterPillTextSelected,
              ]}
            >
              All Visions
            </Text>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                triggerHaptic('light');
                setSelectedFilter(cat);
              }}
              style={[
                styles.filterPill,
                selectedFilter === cat && styles.filterPillSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedFilter === cat && styles.filterPillTextSelected,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Vision Board Cards Grid */}
        <ScrollView
          contentContainerStyle={styles.cardsGrid}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleToggleStatus(item)}
              style={styles.visionCardWrapper}
            >
              <LinearGradient
                colors={['#FFFFFF', PALETTE.paper.linen]}
                style={styles.visionCard}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>
                      {item.category.toUpperCase()}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'Manifested' && styles.statusBadgeManifested,
                      item.status === 'In Flow' && styles.statusBadgeInFlow,
                    ]}
                  >
                    <Sparkles
                      size={10}
                      color={
                        item.status === 'Manifested'
                          ? PALETTE.deltaMint.dark
                          : item.status === 'In Flow'
                          ? PALETTE.polarOpposite.dark
                          : PALETTE.bronze.base
                      }
                    />
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === 'Manifested' &&
                          styles.statusBadgeTextManifested,
                        item.status === 'In Flow' &&
                          styles.statusBadgeTextInFlow,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardIntention}>{item.intention}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.dateRow}>
                    <Calendar size={12} color={PALETTE.ink.muted} />
                    <Text style={styles.dateText}>{item.targetDate || 'Ongoing'}</Text>
                  </View>
                  <Text style={styles.tapTip}>Tap to cycle status</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Modal: Add Vision Item */}
        <Modal
          visible={isAddModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setIsAddModalVisible(false)} style={{ padding: 6 }}>
                <X size={20} color={PALETTE.ink.charcoal} />
              </Pressable>
              <Text style={styles.modalTitle}>ANCHOR NEW VISION</Text>
              <View style={{ width: 32 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <View style={styles.categoryPickerRow}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setNewCategory(cat)}
                    style={[
                      styles.catPickerPill,
                      newCategory === cat && styles.catPickerPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catPickerText,
                        newCategory === cat && styles.catPickerTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>VISION TITLE</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Glass Cliffside Residence in Big Sur"
                placeholderTextColor={PALETTE.ink.muted}
                style={styles.textInput}
              />

              <Text style={styles.inputLabel}>SACRED INTENTION & FEELING</Text>
              <TextInput
                value={newIntention}
                onChangeText={setNewIntention}
                placeholder="How does it feel to wake up inside this reality?"
                placeholderTextColor={PALETTE.ink.muted}
                multiline
                numberOfLines={3}
                style={[styles.textInput, { minHeight: 70, textAlignVertical: 'top' }]}
              />

              <Text style={styles.inputLabel}>TARGET MANIFESTATION DATE</Text>
              <TextInput
                value={newTargetDate}
                onChangeText={setNewTargetDate}
                placeholder="e.g. Autumn 2027"
                placeholderTextColor={PALETTE.ink.muted}
                style={styles.textInput}
              />

              <Pressable onPress={handleAddItem} style={styles.createVisionBtn}>
                <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.createVisionBtnText}>Materialize on Vision Board</Text>
              </Pressable>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
  },
  headerTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.bronze.base,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.bronze.base,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  addBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  filterScroll: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  filterPillSelected: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  filterPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: PALETTE.ink.body,
  },
  filterPillTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  cardsGrid: {
    paddingHorizontal: 18,
    gap: 14,
    paddingTop: 4,
  },
  visionCardWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  visionCard: {
    padding: 18,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPill: {
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: PALETTE.bronze.rich,
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeInFlow: {
    backgroundColor: PALETTE.polarOpposite.light,
    borderColor: PALETTE.polarOpposite.border,
  },
  statusBadgeManifested: {
    backgroundColor: PALETTE.deltaMint.light,
    borderColor: PALETTE.deltaMint.border,
  },
  statusBadgeText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.bronze.rich,
  },
  statusBadgeTextInFlow: {
    color: PALETTE.polarOpposite.dark,
  },
  statusBadgeTextManifested: {
    color: PALETTE.deltaMint.dark,
  },
  cardTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    lineHeight: 24,
  },
  cardIntention: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12.5,
    lineHeight: 18,
    color: PALETTE.ink.body,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.08)',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  tapTip: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.bronze.base,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
  },
  modalTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: PALETTE.bronze.base,
  },
  modalScroll: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  inputLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: PALETTE.bronze.base,
    marginTop: 4,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPickerPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  catPickerPillSelected: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  catPickerText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: PALETTE.ink.body,
  },
  catPickerTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  createVisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 14,
  },
  createVisionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
