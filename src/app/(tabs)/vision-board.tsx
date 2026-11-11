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
            <Plus size={16} color="#07040E" strokeWidth={2.5} />
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
                colors={item.gradientColors}
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
                          ? '#10B981'
                          : PALETTE.gold.base
                      }
                    />
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === 'Manifested' &&
                          styles.statusBadgeTextManifested,
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
                    <Calendar size={12} color="#9CA3AF" />
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
          <LinearGradient
            colors={['#0F0824', '#0A0518', '#05030C']}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setIsAddModalVisible(false)} style={{ padding: 6 }}>
                <X size={20} color="#D1CDDA" />
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
                placeholderTextColor="#6B7280"
                style={styles.textInput}
              />

              <Text style={styles.inputLabel}>SACRED INTENTION & FEELING</Text>
              <TextInput
                value={newIntention}
                onChangeText={setNewIntention}
                placeholder="How does it feel to wake up inside this reality?"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={3}
                style={[styles.textInput, { minHeight: 70, textAlignVertical: 'top' }]}
              />

              <Text style={styles.inputLabel}>TARGET MANIFESTATION DATE</Text>
              <TextInput
                value={newTargetDate}
                onChangeText={setNewTargetDate}
                placeholder="e.g. Autumn 2027"
                placeholderTextColor="#6B7280"
                style={styles.textInput}
              />

              <Pressable onPress={handleAddItem} style={styles.createVisionBtn}>
                <Check size={18} color="#07040E" strokeWidth={2.5} />
                <Text style={styles.createVisionBtnText}>Materialize on Vision Board</Text>
              </Pressable>
            </ScrollView>
          </LinearGradient>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05040A',
  },
  container: {
    flex: 1,
    backgroundColor: '#05040A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 208, 97, 0.12)',
  },
  headerTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.gold.base,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.gold.base,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  addBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: '#07040E',
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterPillSelected: {
    backgroundColor: PALETTE.gold.base,
    borderColor: PALETTE.gold.rich,
  },
  filterPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#D1CDDA',
  },
  filterPillTextSelected: {
    color: '#07040E',
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
    borderColor: 'rgba(245, 208, 97, 0.2)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: PALETTE.gold.base,
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 208, 97, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeInFlow: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  statusBadgeManifested: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  statusBadgeText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.gold.base,
  },
  statusBadgeTextManifested: {
    color: '#10B981',
  },
  cardTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  cardIntention: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#D1CDDA',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: '#9CA3AF',
  },
  tapTip: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: 'rgba(245, 208, 97, 0.6)',
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 208, 97, 0.15)',
  },
  modalTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: PALETTE.gold.base,
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
    color: PALETTE.gold.base,
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  catPickerPillSelected: {
    backgroundColor: PALETTE.gold.base,
    borderColor: PALETTE.gold.rich,
  },
  catPickerText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#D1CDDA',
  },
  catPickerTextSelected: {
    color: '#07040E',
    fontFamily: FONTS.sansBold,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: '#FFFFFF',
  },
  createVisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.gold.base,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 14,
  },
  createVisionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: '#07040E',
  },
});
