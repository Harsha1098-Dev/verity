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
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Volume2,
  Share2,
  Sparkles,
  Bookmark,
  X,
  Zap,
  Layers,
  Check,
  Shuffle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import {
  AffirmationItem,
  AffirmationCategory,
  UserPortalProfile,
  AI3DSceneDefinition,
} from '@/types/portal';
import {
  buildAffirmationFeed,
  generateDynamicAffirmation,
  THEMED_BACKGROUNDS,
  MASTER_CATEGORIES_LIST,
  AI_3D_SCENE_CATALOG,
  LOCAL_3D_SCENE_ASSETS,
  getRandom3DScene,
  get3DSceneById,
} from '@/utils/portalEngine';
import {
  loadPortalProfile,
  loadFavorites,
  toggleFavoriteAffirmation,
} from '@/utils/portalStore';
import { AudioPlayerModal } from '@/components/AudioPlayerModal';

const ALL_CATEGORIES: ('All' | AffirmationCategory)[] = [
  'All',
  ...MASTER_CATEGORIES_LIST,
];

const FLOATING_PARTICLES = [
  { top: '14%', left: '18%', size: 4, opacity: 0.65 },
  { top: '22%', left: '82%', size: 5, opacity: 0.7 },
  { top: '35%', left: '10%', size: 3, opacity: 0.5 },
  { top: '44%', left: '88%', size: 6, opacity: 0.75 },
  { top: '60%', left: '16%', size: 4, opacity: 0.6 },
  { top: '70%', left: '80%', size: 5, opacity: 0.7 },
  { top: '78%', left: '28%', size: 3, opacity: 0.55 },
  { top: '84%', left: '68%', size: 4, opacity: 0.65 },
];

export default function AffirmationsScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [profile, setProfile] = useState<Partial<UserPortalProfile>>({});
  const [feed, setFeed] = useState<AffirmationItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<'All' | AffirmationCategory>('All');
  const [favorites, setFavorites] = useState<AffirmationItem[]>([]);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [scenePickerVisible, setScenePickerVisible] = useState(false);
  const [audioModalVisible, setAudioModalVisible] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [customSceneOverrides, setCustomSceneOverrides] = useState<Record<string, string>>({});

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

    // Generates BOTH a new affirmation AND selects a new dynamic 3D scene
    const freshScene = getRandom3DScene(currentItem?.backgroundTheme?.sceneId);
    const newAff = generateDynamicAffirmation(
      profile,
      category,
      profile.portalTimes?.[0] || '11:11',
      freshScene.id
    );

    setFeed((prev) => [newAff, ...prev]);
    setActiveIndex(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });

    setShareNotice(`✨ New Transmission & 3D ${freshScene.name}`);
    setTimeout(() => setShareNotice(null), 2500);
  };

  const handleCycleSceneForCard = (cardId: string) => {
    triggerHaptic('light');
    const currentSceneId = customSceneOverrides[cardId] || filteredFeed[activeIndex]?.backgroundTheme?.sceneId;
    const nextScene = getRandom3DScene(currentSceneId);
    setCustomSceneOverrides((prev) => ({
      ...prev,
      [cardId]: nextScene.id,
    }));
    setShareNotice(`✨ 3D Scene: ${nextScene.name}`);
    setTimeout(() => setShareNotice(null), 2200);
  };

  const handleSelectSceneFromModal = (sceneId: string, applyToAll = false) => {
    triggerHaptic('success');
    const currentItem = filteredFeed[activeIndex];
    if (applyToAll) {
      const overrides: Record<string, string> = {};
      feed.forEach((f) => {
        overrides[f.id] = sceneId;
      });
      setCustomSceneOverrides(overrides);
    } else if (currentItem) {
      setCustomSceneOverrides((prev) => ({
        ...prev,
        [currentItem.id]: sceneId,
      }));
    }
    const scene = get3DSceneById(sceneId);
    setScenePickerVisible(false);
    setShareNotice(`✨ 3D Scene Applied: ${scene.name}`);
    setTimeout(() => setShareNotice(null), 2200);
  };

  const handleShare = async (item: AffirmationItem) => {
    triggerHaptic('light');
    const message = `✨ Portal 11:11 Affirmation:\n\n“${item.text}”\n\nAttuned to sovereign reality. #Portal1111`;
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

  const currentItem = filteredFeed[activeIndex];
  const activeSceneId = currentItem
    ? (customSceneOverrides[currentItem.id] || currentItem.backgroundTheme?.sceneId || 'scene_liquid_gold')
    : 'scene_liquid_gold';

  return (
    <View style={styles.container}>
      {/* Top Floating Header & Category Bar */}
      <View style={styles.topControlOverlay}>
        <View style={styles.portalHeaderRow}>
          <View style={styles.activePortalTag}>
            <Zap size={13} color={PALETTE.gold.base} />
            <Text style={styles.activePortalTagText}>
              {filteredFeed[activeIndex]?.portalTime || '11:11'} Portal
            </Text>
          </View>

          <View style={styles.topRightControls}>
            {/* 3D Scene Selector Pill */}
            <Pressable
              onPress={() => {
                triggerHaptic('light');
                setScenePickerVisible(true);
              }}
              style={styles.sceneSelectorTopBtn}
              hitSlop={8}
            >
              <Layers size={13} color={PALETTE.gold.base} />
              <Text style={styles.sceneSelectorTopText}>3D Atmosphere</Text>
            </Pressable>

            {/* Saved Bookmarks Button */}
            <Pressable
              onPress={() => setFavoritesModalVisible(true)}
              style={styles.favoritesBtn}
              hitSlop={8}
            >
              <Bookmark size={14} color={PALETTE.gold.base} />
              <Text style={styles.favoritesCountText}>{favorites.length}</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {ALL_CATEGORIES.map((cat) => {
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
      </View>

      {/* Share & Scene Toast Notice */}
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

          // Resolve active 3D scene (with custom card override or default assigned scene)
          const overrideSceneId = customSceneOverrides[item.id];
          const activeScene = overrideSceneId
            ? get3DSceneById(overrideSceneId)
            : (item.backgroundTheme?.sceneId ? get3DSceneById(item.backgroundTheme.sceneId) : null);

          const localKey = activeScene?.localAssetKey || item.backgroundTheme?.localAssetKey;
          const localAsset = localKey ? LOCAL_3D_SCENE_ASSETS[localKey] : null;
          const remoteUri = activeScene?.imageUrl || item.backgroundTheme?.aiSceneUrl;
          const imageSource = localAsset || (remoteUri ? { uri: remoteUri } : null);

          const gradientOverlay =
            activeScene?.gradientOverlay ||
            item.backgroundTheme?.gradient ||
            THEMED_BACKGROUNDS.Wealth.gradient;

          const particleColor =
            activeScene?.particleColor ||
            item.backgroundTheme?.particleColor ||
            '#F5D061';

          const accentGlow =
            activeScene?.accentGlow ||
            item.backgroundTheme?.accentGlow ||
            'rgba(245, 208, 97, 0.45)';

          return (
            <View style={[styles.reelPage, { height: windowHeight }]}>
              {/* Dynamic Photorealistic AI 3D Scene Background */}
              {imageSource ? (
                <ImageBackground
                  source={imageSource}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                >
                  {/* Multi-Stop Dark Vignette Overlay for pristine typography legibility */}
                  <LinearGradient
                    colors={gradientOverlay}
                    style={StyleSheet.absoluteFill}
                  />
                </ImageBackground>
              ) : (
                <LinearGradient
                  colors={gradientOverlay}
                  style={StyleSheet.absoluteFill}
                />
              )}

              {/* Floating Ambient Cosmic Glow Orb */}
              <View style={styles.ambientAtmosphere} pointerEvents="none">
                <View
                  style={[
                    styles.cosmicGlowOrb,
                    { backgroundColor: accentGlow },
                  ]}
                />
              </View>

              {/* Floating 3D Starlight Particles */}
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {FLOATING_PARTICLES.map((p, pIdx) => (
                  <View
                    key={pIdx}
                    style={[
                      styles.shimmerParticle,
                      {
                        top: p.top as any,
                        left: p.left as any,
                        width: p.size,
                        height: p.size,
                        borderRadius: p.size / 2,
                        backgroundColor: particleColor,
                        opacity: p.opacity,
                      },
                    ]}
                  />
                ))}
              </View>

              {/* Glassmorphic Affirmation Card Container */}
              <View style={styles.glassAffirmationCard}>
                {/* Header Row: Category Badge */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.portalPill}>
                    <Sparkles size={11} color={particleColor} />
                    <Text
                      style={[
                        styles.portalPillText,
                        { color: particleColor },
                      ]}
                    >
                      {item.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Large Present-Tense Affirmation Text */}
                <Text style={styles.affirmationText}>“{item.text}”</Text>

                {/* Sub-Insight Reality Note */}
                <Text style={styles.affirmationNoteText}>
                  {item.authorNote}
                </Text>
              </View>

              {/* Bottom Actions Floating Bar */}
              <View style={styles.bottomControlsContainer}>
                {/* Primary Actions: Save, Listen, Regenerate, Share */}
                <View style={styles.bottomActionsBar}>
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

                  {/* Regenerate AI Affirmation + New 3D Scene */}
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

                {/* Previous & Next Tap Buttons */}
                <View style={styles.prevNextRow}>
                  <Pressable
                    onPress={handlePrevious}
                    disabled={index === 0}
                    style={[
                      styles.prevNextBtn,
                      index === 0 && styles.prevNextBtnDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.prevNextBtnText,
                        index === 0 && styles.prevNextBtnTextDisabled,
                      ]}
                    >
                      ← Previous
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleNext}
                    disabled={index === filteredFeed.length - 1}
                    style={[
                      styles.prevNextBtn,
                      index === filteredFeed.length - 1 &&
                      styles.prevNextBtnDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.prevNextBtnText,
                        index === filteredFeed.length - 1 &&
                        styles.prevNextBtnTextDisabled,
                      ]}
                    >
                      Next →
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* 3D Scene Atmosphere Selector Modal */}
      <Modal
        visible={scenePickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setScenePickerVisible(false)}
      >
        <View style={styles.sceneModalContainer}>
          <View style={styles.sceneModalTopBar}>
            <View style={styles.sceneModalTitleRow}>
              <Layers size={18} color={PALETTE.gold.base} />
              <Text style={styles.sceneModalTitle}>AI 3D ATMOSPHERES</Text>
            </View>
            <Pressable
              onPress={() => setScenePickerVisible(false)}
              style={{ padding: 6 }}
            >
              <X size={20} color={PALETTE.gold.base} />
            </Pressable>
          </View>

          <Text style={styles.sceneModalSub}>
            Photorealistic 3D environments rendered to elevate your subconscious reality. Backgrounds rotate dynamically on every swipe and regeneration.
          </Text>

          {/* Quick Surprise Me Button */}
          <Pressable
            onPress={() => {
              const random = getRandom3DScene(activeSceneId);
              handleSelectSceneFromModal(random.id);
            }}
            style={styles.randomSceneBtn}
          >
            <Shuffle size={15} color="#07040E" />
            <Text style={styles.randomSceneBtnText}>Surprise Me (Random 3D Scene)</Text>
          </Pressable>

          <ScrollView
            contentContainerStyle={styles.scenesScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {AI_3D_SCENE_CATALOG.map((scene) => {
              const isSelected = scene.id === activeSceneId;
              const hasLocal = !!scene.localAssetKey && !!LOCAL_3D_SCENE_ASSETS[scene.localAssetKey];

              return (
                <Pressable
                  key={scene.id}
                  onPress={() => handleSelectSceneFromModal(scene.id)}
                  style={[
                    styles.sceneCard,
                    isSelected && styles.sceneCardSelected,
                  ]}
                >
                  <View style={styles.sceneCardLeft}>
                    <View
                      style={[
                        styles.sceneIconDot,
                        { backgroundColor: scene.particleColor },
                      ]}
                    />
                    <View style={styles.sceneInfoBlock}>
                      <View style={styles.sceneNameRow}>
                        <Text style={styles.sceneCardName}>{scene.name}</Text>
                        {hasLocal && (
                          <View style={styles.octane3DTag}>
                            <Text style={styles.octane3DText}>3D OCTANE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.sceneCardStyle}>{scene.style} • {scene.category}</Text>
                      <Text style={styles.sceneCardVibe}>{scene.vibeDescription}</Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.selectedCheckCircle}>
                      <Check size={14} color="#07040E" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Favorites Drawer Modal */}
      <Modal
        visible={favoritesModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFavoritesModalVisible(false)}
      >
        <View style={styles.favoritesModalContainer}>
          <View style={styles.favoritesTopBar}>
            <View style={styles.favoritesTitleRow}>
              <Bookmark size={18} color={PALETTE.bronze.base} />
              <Text style={styles.favoritesTitle}>SAVED AFFIRMATIONS</Text>
            </View>
            <Pressable
              onPress={() => setFavoritesModalVisible(false)}
              style={{ padding: 6 }}
            >
              <X size={20} color={PALETTE.ink.charcoal} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.favoritesScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {favorites.length === 0 ? (
              <View style={styles.emptyFavoritesView}>
                <Sparkles size={32} color={PALETTE.bronze.base} />
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
        </View>
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
    paddingHorizontal: 16,
    gap: 8,
  },
  portalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activePortalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 4, 10, 0.75)',
    borderWidth: 1,
    borderColor: PALETTE.gold.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activePortalTagText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: PALETTE.gold.base,
    letterSpacing: 0.8,
  },
  sceneSelectorTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 4, 10, 0.75)',
    borderWidth: 1,
    borderColor: PALETTE.gold.border,
  },
  sceneSelectorTopText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: PALETTE.gold.base,
    letterSpacing: 0.5,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 12,
  },
  categoryPill: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
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
    fontSize: 11.5,
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
    paddingVertical: 6,
    borderRadius: 16,
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
    top: 96,
    alignSelf: 'center',
    zIndex: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(18, 14, 46, 0.92)',
    borderWidth: 1,
    borderColor: PALETTE.gold.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    paddingHorizontal: 22,
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
    opacity: 0.28,
  },
  shimmerParticle: {
    position: 'absolute',
  },
  glassAffirmationCard: {
    width: '100%',
    backgroundColor: 'rgba(10, 7, 18, 0.62)',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  portalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  portalPillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
  },
  scenePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 208, 97, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.28)',
  },
  scenePillText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10.5,
    color: PALETTE.gold.base,
  },
  affirmationText: {
    fontFamily: FONTS.serifBold,
    fontSize: 26,
    lineHeight: 38,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  affirmationNoteText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.72)',
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 320,
  },
  sceneCycleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sceneCycleText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.gold.base,
    letterSpacing: 0.5,
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 70 : 40,
    left: 20,
    right: 20,
    gap: 10,
  },
  bottomActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(5, 4, 10, 0.75)',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  prevNextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  prevNextBtn: {
    backgroundColor: 'rgba(26, 20, 56, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  prevNextBtnDisabled: {
    opacity: 0.35,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  prevNextBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: PALETTE.gold.base,
    letterSpacing: 0.5,
  },
  prevNextBtnTextDisabled: {
    color: '#9CA3AF',
  },
  sceneModalContainer: {
    flex: 1,
    backgroundColor: '#0A0612',
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  sceneModalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 208, 97, 0.15)',
  },
  sceneModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sceneModalTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: PALETTE.gold.base,
  },
  sceneModalSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: '#D1CDDA',
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 14,
  },
  randomSceneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.gold.base,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  randomSceneBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: '#07040E',
    letterSpacing: 0.5,
  },
  scenesScrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  sceneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 14, 38, 0.75)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
  },
  sceneCardSelected: {
    borderColor: PALETTE.gold.base,
    backgroundColor: 'rgba(38, 24, 62, 0.95)',
  },
  sceneCardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  sceneIconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  sceneInfoBlock: {
    flex: 1,
    gap: 3,
  },
  sceneNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sceneCardName: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  octane3DTag: {
    backgroundColor: 'rgba(245, 208, 97, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  octane3DText: {
    fontFamily: FONTS.sansBold,
    fontSize: 8.5,
    color: PALETTE.gold.base,
    letterSpacing: 0.6,
  },
  sceneCardStyle: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.gold.base,
  },
  sceneCardVibe: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 16,
  },
  selectedCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PALETTE.gold.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  favoritesModalContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  favoritesTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
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
    color: PALETTE.bronze.base,
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
    color: PALETTE.ink.charcoal,
  },
  emptyFavoritesSub: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 24,
  },
  favoriteItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 16,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
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
    color: PALETTE.bronze.base,
    letterSpacing: 1,
  },
  favoriteItemText: {
    fontFamily: FONTS.serif,
    fontSize: 15,
    lineHeight: 22,
    color: PALETTE.ink.charcoal,
  },
});
