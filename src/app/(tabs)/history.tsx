import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, Play, Calendar, Search } from 'lucide-react-native';
import { PALETTE, FONTS, SPACING, RADII, SHADOWS } from '@/constants/theme';
import { PastelBadge, PastelColor } from '@/components/PastelBadge';
import { VerityHeader } from '@/components/VerityHeader';

interface HistoryItem {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  category: string;
  color: PastelColor;
  type: 'affirmation' | 'journal' | 'audio';
  duration?: string;
  isSaved?: boolean;
}

const HISTORY_DATA: HistoryItem[] = [
  {
    id: '1',
    date: 'Monday, Nov 9',
    title: 'Rooted Presence',
    excerpt:
      'I allow my thoughts to pass without judgment. My stillness is my strength.',
    category: 'Presence',
    color: 'deltaMint',
    type: 'audio',
    duration: '5 min practice',
    isSaved: true,
  },
  {
    id: '2',
    date: 'Sunday, Nov 8',
    title: 'Grace in Transition',
    excerpt:
      'I release the urge to control what unfolds. Each ending makes room for aligned beginnings.',
    category: 'Letting Go',
    color: 'berriesCream',
    type: 'affirmation',
    isSaved: false,
  },
  {
    id: '3',
    date: 'Saturday, Nov 7',
    title: 'Morning Clarity Journal',
    excerpt:
      'Noticed how calm the morning felt after a 3-minute intention meditation. Priorities became effortless.',
    category: 'Clarity',
    color: 'prosecco',
    type: 'journal',
    isSaved: true,
  },
  {
    id: '4',
    date: 'Friday, Nov 6',
    title: 'Boundary of Peace',
    excerpt:
      'My energy is sacred. I choose to invest it where my heart finds genuine peace.',
    category: 'Self-Love',
    color: 'foggyLove',
    type: 'audio',
    duration: '3 min practice',
    isSaved: false,
  },
  {
    id: '5',
    date: 'Thursday, Nov 5',
    title: 'Vocal Courage',
    excerpt:
      'My voice carries value. I speak my truth with calm clarity and unwavering self-respect.',
    category: 'Confidence',
    color: 'polarOpposite',
    type: 'affirmation',
    isSaved: true,
  },
];

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filters = ['All', 'Affirmations', 'Audio', 'Journal'];

  const filteredData = HISTORY_DATA.filter((item) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Affirmations') return item.type === 'affirmation';
    if (selectedFilter === 'Audio') return item.type === 'audio';
    if (selectedFilter === 'Journal') return item.type === 'journal';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <VerityHeader title="HISTORY" subtitle="28 Recorded Practices" />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filters.map((f) => {
          const active = selectedFilter === f;
          return (
            <Pressable
              key={f}
              style={[
                styles.filterPill,
                active && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(f)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  active && styles.filterPillTextActive,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* History Entries Feed */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.map((item) => {
          const colorSet = PALETTE[item.color];
          return (
            <View
              key={item.id}
              style={[
                styles.entryCard,
                SHADOWS.subtle,
                { borderLeftColor: colorSet.base },
              ]}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.dateRow}>
                  <Calendar size={13} color={PALETTE.ink.muted} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <PastelBadge label={item.category} color={item.color} />
              </View>

              {/* Title & Excerpt */}
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={styles.entryExcerpt}>“{item.excerpt}”</Text>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                {item.duration ? (
                  <View style={styles.audioTag}>
                    <Play
                      size={11}
                      color={PALETTE.bronze.base}
                      fill={PALETTE.bronze.base}
                    />
                    <Text style={styles.audioTagText}>{item.duration}</Text>
                  </View>
                ) : (
                  <Text style={styles.typeTag}>
                    {item.type.toUpperCase()} ENTRY
                  </Text>
                )}

                <Bookmark
                  size={16}
                  color={item.isSaved ? PALETTE.bronze.base : PALETTE.ink.subtle}
                  fill={item.isSaved ? PALETTE.bronze.base : 'none'}
                />
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.1)',
  },
  filterPillActive: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  filterPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 32,
    gap: 14,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.08)',
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  entryTitle: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    marginBottom: 6,
  },
  entryExcerpt: {
    fontFamily: FONTS.serifItalic,
    fontSize: 14,
    lineHeight: 22,
    color: PALETTE.ink.body,
    marginBottom: SPACING.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.06)',
  },
  audioTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.bronze.subtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  audioTagText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
  typeTag: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    letterSpacing: 0.8,
    color: PALETTE.ink.muted,
  },
});
