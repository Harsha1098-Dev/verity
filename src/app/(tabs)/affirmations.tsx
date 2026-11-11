import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  useWindowDimensions,
  Platform,
  Share,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Volume2,
  Share2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Bookmark,
  X,
  Play,
  RotateCcw,
  Sliders,
  Flame,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import {
  AffirmationItem,
  AffirmationCategory,
  UserPortalProfile,
} from '@/types/portal';
import {
  buildAffirmationFeed,
  generateDynamicAffirmation,
  THEMED_BACKGROUNDS,
} from '@/utils/portalEngine';
import {
  loadPortalProfile,
  loadFavorites,
  toggleFavoriteAffirmation,
} from '@/utils/portalStore';
import { AudioPlayerModal } from '@/components/AudioPlayerModal';

const CATEGORIES: ('All' | AffirmationCategory)[] = [
  'All',
  'Wealth',
  'Career',
  'Love',
  'Confidence',
  'Spiritual',
  'Luxury',
  'Health',
  'Peace',
  'Freedom',
];

export default function AffirmationsScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [profile, setProfile] = useState<Partial<UserPortalProfile>>({});
  const [feed, setFeed] = useState<AffirmationItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<'All' | AffirmationCategory>('All');
  const [favorites, setFavorites] = useState<AffirmationItem[]>([]);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [audioModalVisible, setAudioModalVisible] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<AffirmationItem>>(null);

  useEffect(() => {
    (async () => {
      const p = await loadPortalProfile();
      const favs = await loadFavorites();
      setProfile(p);
      setFavorites(favs);
      const initialFeed = buildAffirmationFeed(p);
      setFeed(initialFeed);
    })();
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'web') {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(
          type === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );
      }
    }
  };

  const handleToggleFavorite = async (item: AffirmationItem) => {
    triggerHaptic('success');
    const updatedFavs = await toggleFavoriteAffirmation(item);
    setFavorites(updatedFavs);
    setFeed((prev) =>
      prev.map((aff) =>
        aff.id === item.id ? { ...aff, isFavorite: !aff.isFavorite } : aff
      )
    );
  };

  const handleRegenerateCurrent = () => {
    triggerHaptic('medium');
    const currentItem = filteredFeed[activeIndex];
    const category = currentItem ? currentItem.category : 'Wealth';
    const newAff = generateDynamicAffirmation(
      profile,
      category,
      profile.portalTimes?.[0] || '11:11'
    );

    setFeed((prev) => [newAff, ...prev]);
    setActiveIndex(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const handleShare = async (item: AffirmationItem) => {
    triggerHaptic('light');
    const message = `✨ Portal 11:11 Affirmation:\n\n“${item.text}”\n\nAttuned to sacred reality. #Portal1111`;
    try {
      if (Platform.OS === 'web') {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          setShareNotice('Affirmation copied to clipboard!');
          setTimeout(() => setShareNotice(null), 2500);
        }
      } else {
        await Share.share({ message });
      }
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const filteredFeed =
    selectedCategory === 'All'
      ? feed
      : feed.filter((item) => item.category === selectedCategory);

  const handleNext = () => {
    if (activeIndex < filteredFeed.length - 1) {
      triggerHaptic('light');
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      triggerHaptic('light');
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Floating Category Selector Bar */}
      <View style={styles.topControlOverlay}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                  setActiveIndex(0);
                }}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={() => setFavoritesModalVisible(true)}
          style={styles.favoritesBtn}
          hitSlop={8}
        >
          <Bookmark size={15} color={PALETTE.gold.base} />
          <Text style={styles.favoritesCountText}>{favorites.length}</Text>
        </Pressable>
      </View>

      {/* Share Toast Notice */}
      {shareNotice && (
        <View style={styles.toastNotice}>
          <Sparkles size={14} color={PALETTE.gold.base} />
          <Text style={styles.toastNoticeText}>{shareNotice}</Text>
        </View>
      )}

      {/* Flagship Vertical TikTok/Reels Swipe FlatList */}
      <FlatList
        ref={flatListRef}
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={windowHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / windowHeight
          );
          if (index >= 0 && index < filteredFeed.length) {
            setActiveIndex(index);
          }
        }}
        renderItem={({ item, index }) => {
          const isFav =
            favorites.some((f) => f.id === item.id) || item.isFavorite;
          const bg = item.backgroundTheme || THEMED_BACKGROUNDS.Wealth;

          return (
            <View style={[styles.reelPage, { height: windowHeight }]}>
              {/* Immersive Full-Screen Themed Background */}
              <LinearGradient
                colors={bg.gradient}
                style={StyleSheet.absoluteFill}
              />

              {/* Floating Ambient Atmosphere Layer */}
              <View style={styles.ambientAtmosphere}>
                <View
                  style={[
                    styles.cosmicGlowOrb,
                    { backgroundColor: bg.accentGlow },
                  ]}
                />
              </View>

              {/* Center Affirmation Card & Transmission */}
              <View style={styles.affirmationContentContainer}>
                {/* Category & Atmosphere Tag */}
                <View style={styles.categoryBadgeRow}>
                  <View style={styles.portalPill}>
                    <Sparkles size={12} color={bg.particleColor} />
                    <Text
                      style={[
                        styles.portalPillText,
                        { color: bg.particleColor },
                      ]}
                    >
                      {item.portalTime || '11:11'} PORTAL • {item.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Large Present-Tense Affirmation Text */}
                <Text style={styles.affirmationText}>“{item.text}”</Text>

                {/* Identity Reality Note */}
                <Text style={styles.affirmationNoteText}>
                  {item.authorNote}
                </Text>
                <Text style={styles.atmosphereSub}>{bg.atmosphereName}</Text>
              </View>

              {/* Bottom Actions Floating Bar */}
              <View style={styles.bottomControlsBar}>
                {/* Like / Save Favorite */}
                <Pressable
                  onPress={() => handleToggleFavorite(item)}
                  style={styles.actionBtn}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      isFav && styles.actionIconCircleActive,
                    ]}
                  >
                    <Heart
                      size={20}
                      color={isFav ? '#FF4D6D' : '#FFFFFF'}
                      fill={isFav ? '#FF4D6D' : 'transparent'}
                    />
                  </View>
                  <Text style={styles.actionLabel}>
                    {isFav ? 'Saved' : 'Save'}
                  </Text>
                </Pressable>

                {/* Listen to Voice Narration */}
                <Pressable
                  onPress={() => {
                    triggerHaptic('light');
                    setAudioModalVisible(true);
                  }}
                  style={styles.actionBtn}
                >
                  <View style={styles.actionIconCircle}>
                    <Volume2 size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionLabel}>Listen</Text>
                </Pressable>

                {/* Regenerate AI Affirmation */}
                <Pressable
                  onPress={handleRegenerateCurrent}
                  style={styles.actionBtn}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      { backgroundColor: 'rgba(245, 208, 97, 0.25)' },
                    ]}
                  >
                    <Sparkles size={20} color={PALETTE.gold.base} />
                  </View>
                  <Text style={[styles.actionLabel, { color: PALETTE.gold.base }]}>
                    Regenerate
                  </Text>
                </Pressable>

                {/* Share Quote Card */}
                <Pressable
                  onPress={() => handleShare(item)}
                  style={styles.actionBtn}
                >
                  <View style={styles.actionIconCircle}>
                    <Share2 size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionLabel}>Share</Text>
                </Pressable>
              </View>

              {/* Prev / Next Swipe Assist Arrows */}
              <View style={styles.verticalNavAssist}>
                {index > 0 && (
                  <Pressable
                    onPress={handlePrevious}
                    style={styles.navAssistBtn}
                  >
                    <ChevronUp size={20} color="rgba(255, 255, 255, 0.6)" />
                  </Pressable>
                )}
                {index < filteredFeed.length - 1 && (
                  <Pressable onPress={handleNext} style={styles.navAssistBtn}>
                    <ChevronDown size={20} color="rgba(255, 255, 255, 0.6)" />
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Favorites Drawer Modal */}
      <Modal
        visible={favoritesModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFavoritesModalVisible(false)}
      >
        <LinearGradient
          colors={['#0F0824', '#0A0518', '#05030C']}
          style={styles.favoritesModalContainer}
        >
          <View style={styles.favoritesTopBar}>
            <View style={styles.favoritesTitleRow}>
              <Bookmark size={18} color={PALETTE.gold.base} />
              <Text style={styles.favoritesTitle}>SAVED AFFIRMATIONS</Text>
            </View>
            <Pressable
              onPress={() => setFavoritesModalVisible(false)}
              style={{ padding: 6 }}
            >
              <X size={20} color="#D1CDDA" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.favoritesScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {favorites.length === 0 ? (
              <View style={styles.emptyFavoritesView}>
                <Sparkles size={32} color={PALETTE.gold.base} />
                <Text style={styles.emptyFavoritesTitle}>No Saved Affirmations Yet</Text>
                <Text style={styles.emptyFavoritesSub}>
                  Tap the ❤️ heart icon on any portal affirmation to anchor it into your favorites collection.
                </Text>
              </View>
            ) : (
              favorites.map((fav) => (
                <View key={fav.id} style={styles.favoriteItemCard}>
                  <View style={styles.favoriteCardCategoryRow}>
                    <Text style={styles.favoriteCategoryTag}>
                      {fav.category} • {fav.portalTime || '11:11'}
                    </Text>
                    <Pressable onPress={() => handleToggleFavorite(fav)}>
                      <Heart size={16} color="#FF4D6D" fill="#FF4D6D" />
                    </Pressable>
                  </View>
                  <Text style={styles.favoriteItemText}>“{fav.text}”</Text>
                </View>
              ))
            )}
          </ScrollView>
        </LinearGradient>
      </Modal>

      {/* Voice Narration Audio Player Modal */}
      <AudioPlayerModal
        visible={audioModalVisible}
        onClose={() => setAudioModalVisible(false)}
        title={
          filteredFeed[activeIndex]?.category
            ? `${filteredFeed[activeIndex]?.category} Frequency Alignment`
            : 'Sovereign Manifestation'
        }
        category="11:11 Transmission"
        durationSeconds={180}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05040A',
  },
  topControlOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 12,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(5, 4, 10, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryPillSelected: {
    backgroundColor: PALETTE.gold.base,
    borderColor: PALETTE.gold.rich,
  },
  categoryPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: '#D1CDDA',
  },
  categoryPillTextSelected: {
    color: '#07040E',
    fontFamily: FONTS.sansBold,
  },
  favoritesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: 'rgba(5, 4, 10, 0.7)',
    borderWidth: 1,
    borderColor: PALETTE.gold.border,
  },
  favoritesCountText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: PALETTE.gold.base,
  },
  toastNotice: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    zIndex: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#120E2E',
    borderWidth: 1,
    borderColor: PALETTE.gold.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toastNoticeText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  reelPage: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  ambientAtmosphere: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cosmicGlowOrb: {
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.25,
  },
  affirmationContentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  categoryBadgeRow: {
    marginBottom: 20,
  },
  portalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  portalPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  affirmationText: {
    fontFamily: FONTS.serifBold,
    fontSize: 27,
    lineHeight: 40,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  affirmationNoteText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 320,
  },
  atmosphereSub: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  bottomControlsBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 70 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(5, 4, 10, 0.55)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircleActive: {
    backgroundColor: 'rgba(255, 77, 109, 0.25)',
  },
  actionLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10.5,
    color: '#D1CDDA',
  },
  verticalNavAssist: {
    position: 'absolute',
    right: 12,
    top: '45%',
    gap: 16,
  },
  navAssistBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  favoritesModalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  favoritesTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 208, 97, 0.15)',
  },
  favoritesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoritesTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: PALETTE.gold.base,
  },
  favoritesScrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  emptyFavoritesView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyFavoritesTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  emptyFavoritesSub: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 24,
  },
  favoriteItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.2)',
    padding: 16,
  },
  favoriteCardCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteCategoryTag: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.gold.base,
    letterSpacing: 1,
  },
  favoriteItemText: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },
});
