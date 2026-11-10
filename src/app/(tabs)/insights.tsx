import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Flame, Sparkles, Compass } from 'lucide-react-native';
import { PALETTE, FONTS, SPACING, RADII, SHADOWS } from '@/constants/theme';
import { VerityHeader } from '@/components/VerityHeader';
import { PastelColor } from '@/components/PastelBadge';

interface MoodDistributionItem {
  label: string;
  percentage: number;
  color: PastelColor;
}

const MOOD_DISTRIBUTION: MoodDistributionItem[] = [
  { label: 'Calm & Grounded', percentage: 38, color: 'deltaMint' },
  { label: 'Mental Clarity', percentage: 28, color: 'prosecco' },
  { label: 'Joy & Radiance', percentage: 18, color: 'berriesCream' },
  { label: 'Peaceful Focus', percentage: 10, color: 'polarOpposite' },
  { label: 'Deep Gratitude', percentage: 6, color: 'foggyLove' },
];

const WEEK_DAYS = [
  { day: 'M', height: 75, active: true },
  { day: 'T', height: 90, active: true },
  { day: 'W', height: 60, active: true },
  { day: 'T', height: 85, active: true },
  { day: 'F', height: 100, active: true },
  { day: 'S', height: 50, active: true },
  { day: 'S', height: 95, active: true },
];

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <VerityHeader title="INSIGHTS" subtitle="Your Mindful Rhythm" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Cards Row */}
        <View style={styles.metricsRow}>
          {/* Minutes */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: PALETTE.prosecco.light, borderColor: PALETTE.prosecco.border },
            ]}
          >
            <View style={styles.metricIconCircle}>
              <Clock size={14} color={PALETTE.bronze.base} />
            </View>
            <Text style={styles.metricValue}>142</Text>
            <Text style={styles.metricLabel}>Mindful Min</Text>
          </View>

          {/* Streak */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: PALETTE.berriesCream.light,
                borderColor: PALETTE.berriesCream.border,
              },
            ]}
          >
            <View style={styles.metricIconCircle}>
              <Flame size={14} color={PALETTE.berriesCream.dark} />
            </View>
            <Text style={styles.metricValue}>12</Text>
            <Text style={styles.metricLabel}>Day Streak</Text>
          </View>

          {/* Anchors */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: PALETTE.deltaMint.light, borderColor: PALETTE.deltaMint.border },
            ]}
          >
            <View style={styles.metricIconCircle}>
              <Sparkles size={14} color={PALETTE.deltaMint.dark} />
            </View>
            <Text style={styles.metricValue}>36</Text>
            <Text style={styles.metricLabel}>Practices</Text>
          </View>
        </View>

        {/* Weekly Consistency Chart */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>7-Day Practice Rhythm</Text>
              <Text style={styles.chartSubtitle}>Every morning completed</Text>
            </View>
            <TrendingUp size={18} color={PALETTE.bronze.base} />
          </View>

          <View style={styles.barsContainer}>
            {WEEK_DAYS.map((w, idx) => (
              <View key={idx} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${w.height}%`,
                        backgroundColor:
                          idx === 6
                            ? PALETTE.bronze.base
                            : PALETTE.prosecco.base,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barDayText}>{w.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mood Distribution */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <Text style={styles.chartTitle}>Emotional Harmony</Text>
          <Text style={styles.chartSubtitle}>
            How your mindfulness practice shapes your inner state
          </Text>

          <View style={styles.moodList}>
            {MOOD_DISTRIBUTION.map((m) => {
              const pal = PALETTE[m.color];
              return (
                <View key={m.label} style={styles.moodRow}>
                  <View style={styles.moodLabelRow}>
                    <View
                      style={[styles.colorDot, { backgroundColor: pal.base }]}
                    />
                    <Text style={styles.moodLabelText}>{m.label}</Text>
                    <Text style={styles.moodPercentText}>{m.percentage}%</Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${m.percentage}%`,
                          backgroundColor: pal.base,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Editorial Takeaway */}
        <View style={[styles.takeawayCard, SHADOWS.subtle]}>
          <View style={styles.takeawayIconBox}>
            <Compass size={20} color={PALETTE.bronze.base} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.takeawayTitle}>Weekly Observation</Text>
            <Text style={styles.takeawayBody}>
              “You report feeling 42% calmer on days you complete your 3-minute
              intention practice before 8:00 AM.”
            </Text>
          </View>
        </View>

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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 32,
    gap: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: RADII.lg,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontFamily: FONTS.serifBold,
    fontSize: 22,
    color: PALETTE.ink.charcoal,
  },
  metricLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.ink.muted,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.08)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  chartTitle: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
  },
  chartSubtitle: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    color: PALETTE.ink.muted,
    marginTop: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 11,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 11,
    width: '100%',
  },
  barDayText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.ink.muted,
    marginTop: 8,
  },
  moodList: {
    marginTop: SPACING.lg,
    gap: 12,
  },
  moodRow: {
    gap: 6,
  },
  moodLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  moodLabelText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
    flex: 1,
  },
  moodPercentText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.paper.linen,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  takeawayCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: PALETTE.bronze.subtle,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
  },
  takeawayIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeawayTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: PALETTE.bronze.base,
    letterSpacing: 0.4,
  },
  takeawayBody: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: PALETTE.ink.charcoal,
    marginTop: 4,
  },
});
