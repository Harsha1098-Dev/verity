import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Crown,
  Check,
  ShieldCheck,
  CreditCard,
  Building2,
  Zap,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  QrCode,
  Edit3,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import {
  MEMBERSHIP_TIERS,
  MembershipPlan,
  ConnectedBankDetails,
  fetchConnectedBankDetails,
  saveConnectedBankDetails,
  initiatePaymentOrder,
  processPaymentVerification,
  saveMembershipTier,
} from '@/services/paymentService';

interface PaymentGatewayModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (tier: MembershipPlan) => void;
  initialTab?: 'checkout' | 'banking';
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialTab = 'checkout',
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobileScreen = windowWidth < 520;
  const isCompact = windowHeight < 740;

  // Active Tab: 'checkout' vs 'banking'
  const [activeTab, setActiveTab] = useState<'checkout' | 'banking'>(initialTab);

  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>(MEMBERSHIP_TIERS[1]); // 11:11 Sovereign Annual

  // Payment Method: 'upi' | 'card' | 'netbanking' | 'direct_bank'
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'direct_bank'>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');

  // Connected Merchant Bank State
  const [bankDetails, setBankDetails] = useState<ConnectedBankDetails | null>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: '',
    accountType: 'CURRENT',
    upiId: '',
  });

  // Transaction States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);

  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
      setPaymentSuccessData(null);
      setErrorMessage(null);
      setSuccessNotice(null);
      loadBankData();
    }
  }, [visible, initialTab]);

  const loadBankData = async () => {
    const details = await fetchConnectedBankDetails();
    setBankDetails(details);
    setBankForm({
      accountHolderName: details.accountHolderName,
      accountNumber: details.rawAccountNumber || '50100458921478',
      ifscCode: details.ifscCode,
      bankName: details.bankName,
      branch: details.branch || 'Banjara Hills',
      accountType: details.accountType || 'CURRENT',
      upiId: details.upiId,
    });
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'error' = 'light') => {
    if (Platform.OS !== 'web') {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'error') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.impactAsync(
          type === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
        );
      }
    }
  };

  // 1. Process Payment Gateway Checkout
  const handleProceedPayment = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    triggerHaptic('medium');

    try {
      // Step A: Create Gateway Order
      const orderRes = await initiatePaymentOrder(selectedPlan.id);

      // Step B: Simulate / Trigger Payment Execution
      const mockPaymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

      let methodLabel = 'UPI (Google Pay)';
      if (paymentMethod === 'upi') {
        methodLabel = upiProvider === 'phonepe' ? 'UPI (PhonePe)' : upiProvider === 'paytm' ? 'UPI (Paytm)' : 'UPI (Google Pay)';
      } else if (paymentMethod === 'card') {
        methodLabel = 'Card (Visa / RuPay)';
      } else if (paymentMethod === 'netbanking') {
        methodLabel = 'Net Banking (HDFC)';
      } else {
        methodLabel = 'Direct IMPS Settlement';
      }

      // Step C: Verify & Settle to Connected Bank Account
      const verifyRes = await processPaymentVerification({
        orderId: orderRes.orderId,
        paymentId: mockPaymentId,
        tierId: selectedPlan.id,
        paymentMethod: methodLabel,
      });

      setIsLoading(false);

      if (verifyRes.success) {
        triggerHaptic('success');
        setPaymentSuccessData({
          ...verifyRes,
          plan: selectedPlan,
          paymentMethod: methodLabel,
        });
        await saveMembershipTier(selectedPlan.id);
        if (onSuccess) onSuccess(selectedPlan);
      } else {
        setErrorMessage(verifyRes.error || 'Payment gateway verification failed');
        triggerHaptic('error');
      }
    } catch (e: any) {
      setIsLoading(false);
      setErrorMessage(e.message || 'Payment transaction encountered an error');
      triggerHaptic('error');
    }
  };

  // 2. Save / Update Connected Bank Details Directly
  const handleSaveBankDetails = async () => {
    if (!bankForm.accountHolderName || bankForm.accountHolderName.trim().length < 3) {
      setErrorMessage('Please enter a valid Account Holder Name (minimum 3 characters)');
      triggerHaptic('error');
      return;
    }
    if (!bankForm.accountNumber || bankForm.accountNumber.trim().length < 9) {
      setErrorMessage('Please enter a valid Bank Account Number (minimum 9 digits)');
      triggerHaptic('error');
      return;
    }
    if (!bankForm.ifscCode || bankForm.ifscCode.trim().length !== 11) {
      setErrorMessage('Please enter a valid 11-digit IFSC code (e.g. HDFC0000060)');
      triggerHaptic('error');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    triggerHaptic('medium');

    const result = await saveConnectedBankDetails({
      accountHolderName: bankForm.accountHolderName.trim(),
      rawAccountNumber: bankForm.accountNumber.trim(),
      ifscCode: bankForm.ifscCode.trim().toUpperCase(),
      bankName: bankForm.bankName.trim() || 'Verified Bank',
      branch: bankForm.branch.trim() || 'Main Branch',
      accountType: bankForm.accountType || 'CURRENT',
      upiId: bankForm.upiId.trim() || `${bankForm.accountHolderName.toLowerCase().replace(/\s+/g, '')}@upi`,
    });

    setIsLoading(false);

    if (result.success && result.bankDetails) {
      setBankDetails(result.bankDetails);
      setIsEditingBank(false);
      setSuccessNotice('Direct settlement bank account connected successfully!');
      triggerHaptic('success');
      setTimeout(() => setSuccessNotice(null), 3000);
    } else {
      setErrorMessage(result.error || 'Failed to update bank details');
      triggerHaptic('error');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={!isMobileScreen}
      onRequestClose={onClose}
    >
      <View style={isMobileScreen ? styles.mobileContainer : styles.desktopOverlay}>
        <View
          style={[
            isMobileScreen ? styles.mobileCard : styles.desktopCard,
            {
              paddingTop: Math.max(insets.top, 14),
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Top Bar Header */}
          <View style={styles.topBar}>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <X size={20} color={PALETTE.ink.charcoal} />
            </Pressable>

            {/* Mode Switch Tabs: Ascend to VIP vs Merchant Banking */}
            <View style={styles.tabSwitcher}>
              <Pressable
                onPress={() => {
                  triggerHaptic('light');
                  setActiveTab('checkout');
                }}
                style={[styles.tabBtn, activeTab === 'checkout' && styles.tabBtnActive]}
              >
                <Crown
                  size={13}
                  color={activeTab === 'checkout' ? PALETTE.bronze.base : PALETTE.ink.muted}
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    activeTab === 'checkout' && styles.tabBtnTextActive,
                  ]}
                >
                  Ascend to VIP
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  triggerHaptic('light');
                  setActiveTab('banking');
                }}
                style={[styles.tabBtn, activeTab === 'banking' && styles.tabBtnActive]}
              >
                <Building2
                  size={13}
                  color={activeTab === 'banking' ? PALETTE.bronze.base : PALETTE.ink.muted}
                />
                <Text
                  style={[
                    styles.tabBtnText,
                    activeTab === 'banking' && styles.tabBtnTextActive,
                  ]}
                >
                  Direct Bank
                </Text>
              </Pressable>
            </View>

            <View style={{ width: 28 }} />
          </View>

          {/* Notices */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {successNotice && (
            <View style={styles.successBox}>
              <CheckCircle2 size={13} color="#059669" />
              <Text style={styles.successText}>{successNotice}</Text>
            </View>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* ========================================================
                VIEW 1: PAYMENT SUCCESS RECEIPT SCREEN
               ======================================================== */}
            {paymentSuccessData ? (
              <View style={styles.successContainer}>
                <View style={styles.successBadgeCircle}>
                  <Check size={36} color="#FFFFFF" strokeWidth={3} />
                </View>

                <Text style={styles.successTitle}>Sovereign Mastery Unlocked</Text>
                <Text style={styles.successSub}>
                  Your sacred payment of ₹{paymentSuccessData.plan?.amount} has been verified and settled directly to your bank account.
                </Text>

                {/* Receipt Card */}
                <View style={styles.receiptCard}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Plan Activated</Text>
                    <Text style={styles.receiptValue}>{paymentSuccessData.plan?.name}</Text>
                  </View>
                  <View style={styles.receiptDivider} />
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Transaction ID</Text>
                    <Text style={[styles.receiptValue, { fontSize: 11 }]}>
                      {paymentSuccessData.transactionId}
                    </Text>
                  </View>
                  <View style={styles.receiptDivider} />
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Payment Method</Text>
                    <Text style={styles.receiptValue}>{paymentSuccessData.paymentMethod}</Text>
                  </View>
                  <View style={styles.receiptDivider} />
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Direct Settlement To</Text>
                    <Text style={[styles.receiptValue, { color: PALETTE.bronze.base }]}>
                      {paymentSuccessData.settlement?.bankName} ({paymentSuccessData.settlement?.accountNumberMasked})
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={onClose}
                  style={styles.primaryActionBtn}
                >
                  <Text style={styles.primaryActionBtnText}>Enter Sovereign Portal</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : activeTab === 'checkout' ? (
              /* ========================================================
                  VIEW 2: PAYMENT GATEWAY CHECKOUT & TIERS
                 ======================================================== */
              <View style={styles.checkoutContainer}>
                {/* Header Title */}
                <View style={styles.heroBlock}>
                  <Text style={styles.heroTitle}>Ascend to Sovereign Mastery</Text>
                  <Text style={styles.heroSub}>
                    Unlock all 10 AI 3D realms, delta-wave audio, and custom reality affirmations.
                  </Text>
                </View>

                {/* Membership Plans Cards */}
                <View style={styles.plansContainer}>
                  {MEMBERSHIP_TIERS.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    return (
                      <Pressable
                        key={plan.id}
                        onPress={() => {
                          triggerHaptic('light');
                          setSelectedPlan(plan);
                        }}
                        style={[
                          styles.planCard,
                          isSelected && styles.planCardSelected,
                        ]}
                      >
                        <View style={styles.planCardTop}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text
                                style={[
                                  styles.planName,
                                  isSelected && styles.planNameSelected,
                                ]}
                              >
                                {plan.name}
                              </Text>
                              {plan.isPopular && (
                                <View style={styles.popularBadge}>
                                  <Text style={styles.popularBadgeText}>MOST SACRED</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.planDesc}>{plan.description}</Text>
                          </View>

                          <View style={styles.planPriceBlock}>
                            <Text
                              style={[
                                styles.planAmount,
                                isSelected && styles.planAmountSelected,
                              ]}
                            >
                              ₹{plan.amount}
                            </Text>
                            <Text style={styles.planPeriod}>{plan.period}</Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Features Included */}
                <View style={styles.featuresList}>
                  <Text style={styles.featuresHeading}>INCLUDED IN YOUR SOVEREIGN MEMBERSHIP</Text>
                  <View style={styles.featureItemRow}>
                    <Check size={14} color={PALETTE.bronze.base} />
                    <Text style={styles.featureItemText}>Full access to all 10 photorealistic 3D atmospheres</Text>
                  </View>
                  <View style={styles.featureItemRow}>
                    <Check size={14} color={PALETTE.bronze.base} />
                    <Text style={styles.featureItemText}>Personalized 15-question neural affirmation synthesis</Text>
                  </View>
                  <View style={styles.featureItemRow}>
                    <Check size={14} color={PALETTE.bronze.base} />
                    <Text style={styles.featureItemText}>Custom studio voice narration & delta-wave audio</Text>
                  </View>
                  <View style={styles.featureItemRow}>
                    <Check size={14} color={PALETTE.bronze.base} />
                    <Text style={styles.featureItemText}>Direct merchant bank settlement for all creator payouts</Text>
                  </View>
                </View>

                {/* Payment Gateway Method Selector */}
                <View style={styles.methodSelectorSection}>
                  <Text style={styles.methodHeading}>CHOOSE PAYMENT METHOD</Text>

                  {/* UPI Option */}
                  <Pressable
                    onPress={() => {
                      triggerHaptic('light');
                      setPaymentMethod('upi');
                    }}
                    style={[
                      styles.methodRow,
                      paymentMethod === 'upi' && styles.methodRowActive,
                    ]}
                  >
                    <View style={styles.methodLeft}>
                      <Zap size={18} color={PALETTE.bronze.base} />
                      <View>
                        <Text style={styles.methodName}>UPI Instant Payment</Text>
                        <Text style={styles.methodSub}>Google Pay, PhonePe, Paytm, or any UPI ID</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        paymentMethod === 'upi' && styles.radioCircleActive,
                      ]}
                    >
                      {paymentMethod === 'upi' && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>

                  {/* UPI Sub-providers */}
                  {paymentMethod === 'upi' && (
                    <View style={styles.upiOptionsRow}>
                      <Pressable
                        onPress={() => setUpiProvider('gpay')}
                        style={[
                          styles.upiPill,
                          upiProvider === 'gpay' && styles.upiPillActive,
                        ]}
                      >
                        <Text style={styles.upiPillText}>Google Pay</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setUpiProvider('phonepe')}
                        style={[
                          styles.upiPill,
                          upiProvider === 'phonepe' && styles.upiPillActive,
                        ]}
                      >
                        <Text style={styles.upiPillText}>PhonePe</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setUpiProvider('paytm')}
                        style={[
                          styles.upiPill,
                          upiProvider === 'paytm' && styles.upiPillActive,
                        ]}
                      >
                        <Text style={styles.upiPillText}>Paytm</Text>
                      </Pressable>
                    </View>
                  )}

                  {/* Cards / Net Banking */}
                  <Pressable
                    onPress={() => {
                      triggerHaptic('light');
                      setPaymentMethod('card');
                    }}
                    style={[
                      styles.methodRow,
                      paymentMethod === 'card' && styles.methodRowActive,
                    ]}
                  >
                    <View style={styles.methodLeft}>
                      <CreditCard size={18} color={PALETTE.bronze.base} />
                      <View>
                        <Text style={styles.methodName}>Debit / Credit Card</Text>
                        <Text style={styles.methodSub}>Visa, RuPay, Mastercard with 256-bit encryption</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        paymentMethod === 'card' && styles.radioCircleActive,
                      ]}
                    >
                      {paymentMethod === 'card' && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>

                  {/* Direct Bank Transfer (IMPS / NEFT) */}
                  <Pressable
                    onPress={() => {
                      triggerHaptic('light');
                      setPaymentMethod('direct_bank');
                    }}
                    style={[
                      styles.methodRow,
                      paymentMethod === 'direct_bank' && styles.methodRowActive,
                    ]}
                  >
                    <View style={styles.methodLeft}>
                      <Building2 size={18} color={PALETTE.bronze.base} />
                      <View>
                        <Text style={styles.methodName}>Direct Bank Deposit (IMPS / NEFT)</Text>
                        <Text style={styles.methodSub}>
                          Transfer directly to {bankDetails?.bankName || 'Merchant Bank'}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        paymentMethod === 'direct_bank' && styles.radioCircleActive,
                      ]}
                    >
                      {paymentMethod === 'direct_bank' && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>

                  {/* Direct Beneficiary Bank Details preview if direct_bank selected */}
                  {paymentMethod === 'direct_bank' && bankDetails && (
                    <View style={styles.bankDirectPreviewBox}>
                      <Text style={styles.bankDirectTitle}>Beneficiary Direct Bank Details</Text>
                      <View style={styles.bankDirectRow}>
                        <Text style={styles.bankDirectLabel}>Account Holder:</Text>
                        <Text style={styles.bankDirectVal}>{bankDetails.accountHolderName}</Text>
                      </View>
                      <View style={styles.bankDirectRow}>
                        <Text style={styles.bankDirectLabel}>Bank Name:</Text>
                        <Text style={styles.bankDirectVal}>{bankDetails.bankName}</Text>
                      </View>
                      <View style={styles.bankDirectRow}>
                        <Text style={styles.bankDirectLabel}>Account Number:</Text>
                        <Text style={styles.bankDirectVal}>{bankDetails.rawAccountNumber || bankDetails.maskedAccountNumber}</Text>
                      </View>
                      <View style={styles.bankDirectRow}>
                        <Text style={styles.bankDirectLabel}>IFSC Code:</Text>
                        <Text style={styles.bankDirectVal}>{bankDetails.ifscCode}</Text>
                      </View>
                      <View style={styles.bankDirectRow}>
                        <Text style={styles.bankDirectLabel}>UPI VPA ID:</Text>
                        <Text style={styles.bankDirectVal}>{bankDetails.upiId}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Settle to Connected Bank Notice */}
                <View style={styles.settleNoticeBox}>
                  <ShieldCheck size={14} color={PALETTE.bronze.base} />
                  <Text style={styles.settleNoticeText}>
                    Direct Settlement Active: Payments route directly to{' '}
                    <Text style={{ fontFamily: FONTS.sansBold }}>
                      {bankDetails?.bankName} ({bankDetails?.maskedAccountNumber})
                    </Text>
                  </Text>
                </View>

                {/* Primary Pay Action Button */}
                <Pressable
                  onPress={handleProceedPayment}
                  disabled={isLoading}
                  style={[styles.primaryActionBtn, isLoading && styles.btnDisabled]}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Lock size={15} color="#FFFFFF" />
                      <Text style={styles.primaryActionBtnText}>
                        Pay ₹{selectedPlan.amount} & Activate Sovereign VIP
                      </Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </>
                  )}
                </Pressable>
              </View>
            ) : (
              /* ========================================================
                  VIEW 3: DIRECT MERCHANT BANK CONNECTION & SETTINGS
                 ======================================================== */
              <View style={styles.bankingContainer}>
                <View style={styles.heroBlock}>
                  <Text style={styles.heroTitle}>Connected Bank Details</Text>
                  <Text style={styles.heroSub}>
                    Direct settlement destination for all Razorpay, UPI, and membership payouts.
                  </Text>
                </View>

                {/* Connected Bank Card */}
                {!isEditingBank && bankDetails ? (
                  <View style={styles.connectedBankCard}>
                    <View style={styles.bankCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Building2 size={20} color={PALETTE.bronze.base} />
                        <Text style={styles.bankCardBankName}>{bankDetails.bankName}</Text>
                      </View>
                      <View style={styles.verifiedBadge}>
                        <ShieldCheck size={12} color="#059669" />
                        <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                      </View>
                    </View>

                    <View style={styles.bankCardBody}>
                      <View style={styles.bankFieldRow}>
                        <Text style={styles.bankFieldLabel}>Account Holder</Text>
                        <Text style={styles.bankFieldValue}>{bankDetails.accountHolderName}</Text>
                      </View>

                      <View style={styles.bankFieldRow}>
                        <Text style={styles.bankFieldLabel}>Account Number</Text>
                        <Text style={[styles.bankFieldValue, { letterSpacing: 1.5 }]}>
                          {bankDetails.rawAccountNumber || bankDetails.maskedAccountNumber}
                        </Text>
                      </View>

                      <View style={styles.bankFieldRow}>
                        <Text style={styles.bankFieldLabel}>IFSC Code</Text>
                        <Text style={styles.bankFieldValue}>{bankDetails.ifscCode}</Text>
                      </View>

                      <View style={styles.bankFieldRow}>
                        <Text style={styles.bankFieldLabel}>Branch</Text>
                        <Text style={styles.bankFieldValue}>{bankDetails.branch || 'Banjara Hills'}</Text>
                      </View>

                      <View style={styles.bankFieldRow}>
                        <Text style={styles.bankFieldLabel}>UPI VPA ID</Text>
                        <Text style={styles.bankFieldValue}>{bankDetails.upiId}</Text>
                      </View>

                      <View style={styles.bankFieldRow}>
                        <Text style={styles.bankFieldLabel}>Settlement Cycle</Text>
                        <Text style={[styles.bankFieldValue, { color: '#059669' }]}>
                          {bankDetails.settlementSchedule}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => setIsEditingBank(true)}
                      style={styles.editBankBtn}
                    >
                      <Edit3 size={14} color={PALETTE.bronze.base} />
                      <Text style={styles.editBankBtnText}>Edit / Connect New Bank Account</Text>
                    </Pressable>
                  </View>
                ) : (
                  /* Edit / Connect Bank Form */
                  <View style={styles.bankFormContainer}>
                    <Text style={styles.formHeading}>Connect Direct Bank Account</Text>

                    <View style={styles.formField}>
                      <Text style={styles.inputLabel}>Account Holder Name (as in bank records)</Text>
                      <TextInput
                        value={bankForm.accountHolderName}
                        onChangeText={(t) => setBankForm({ ...bankForm, accountHolderName: t })}
                        placeholder="e.g. Harsha Vardhan"
                        placeholderTextColor={PALETTE.ink.muted}
                        style={styles.formInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.inputLabel}>Bank Name</Text>
                      <TextInput
                        value={bankForm.bankName}
                        onChangeText={(t) => setBankForm({ ...bankForm, bankName: t })}
                        placeholder="e.g. HDFC Bank Ltd"
                        placeholderTextColor={PALETTE.ink.muted}
                        style={styles.formInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.inputLabel}>Bank Account Number</Text>
                      <TextInput
                        value={bankForm.accountNumber}
                        onChangeText={(t) => setBankForm({ ...bankForm, accountNumber: t.replace(/\D/g, '') })}
                        placeholder="9 to 18 digits"
                        placeholderTextColor={PALETTE.ink.muted}
                        keyboardType="number-pad"
                        style={styles.formInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.inputLabel}>IFSC Code (11 alphanumeric characters)</Text>
                      <TextInput
                        value={bankForm.ifscCode}
                        onChangeText={(t) => setBankForm({ ...bankForm, ifscCode: t.toUpperCase() })}
                        placeholder="e.g. HDFC0000060"
                        placeholderTextColor={PALETTE.ink.muted}
                        autoCapitalize="characters"
                        maxLength={11}
                        style={styles.formInput}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.inputLabel}>UPI ID (for instant UPI settlements)</Text>
                      <TextInput
                        value={bankForm.upiId}
                        onChangeText={(t) => setBankForm({ ...bankForm, upiId: t.toLowerCase() })}
                        placeholder="e.g. harsha@okhdfcbank"
                        placeholderTextColor={PALETTE.ink.muted}
                        autoCapitalize="none"
                        style={styles.formInput}
                      />
                    </View>

                    <View style={styles.formButtonsRow}>
                      {bankDetails && (
                        <Pressable
                          onPress={() => setIsEditingBank(false)}
                          style={styles.cancelFormBtn}
                        >
                          <Text style={styles.cancelFormBtnText}>Cancel</Text>
                        </Pressable>
                      )}

                      <Pressable
                        onPress={handleSaveBankDetails}
                        disabled={isLoading}
                        style={[styles.saveBankBtn, isLoading && styles.btnDisabled]}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Check size={16} color="#FFFFFF" />
                            <Text style={styles.saveBankBtnText}>Save & Connect Bank</Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  desktopOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 22, 20, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mobileCard: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  desktopCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 20,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.1)',
  },
  closeBtn: {
    padding: 6,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: PALETTE.ink.muted,
  },
  tabBtnTextActive: {
    fontFamily: FONTS.sansBold,
    color: PALETTE.ink.charcoal,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 21,
    color: PALETTE.ink.charcoal,
    textAlign: 'center',
  },
  heroSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  plansContainer: {
    gap: 10,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 14,
  },
  planCardSelected: {
    borderColor: PALETTE.bronze.base,
    backgroundColor: '#FFFDF9',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  planCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  planName: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
  },
  planNameSelected: {
    color: PALETTE.bronze.base,
  },
  popularBadge: {
    backgroundColor: PALETTE.bronze.base,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planDesc: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
    marginTop: 3,
    lineHeight: 15,
  },
  planPriceBlock: {
    alignItems: 'flex-end',
  },
  planAmount: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
  },
  planAmountSelected: {
    color: PALETTE.bronze.base,
  },
  planPeriod: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.1)',
    gap: 8,
    marginBottom: 16,
  },
  featuresHeading: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    color: PALETTE.bronze.base,
    letterSpacing: 1,
    marginBottom: 2,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureItemText: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: PALETTE.ink.charcoal,
    flex: 1,
  },
  methodSelectorSection: {
    gap: 8,
    marginBottom: 14,
  },
  methodHeading: {
    fontFamily: FONTS.sansBold,
    fontSize: 10.5,
    color: PALETTE.bronze.base,
    letterSpacing: 1,
    marginBottom: 4,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  methodRowActive: {
    borderColor: PALETTE.bronze.base,
    backgroundColor: '#FFFDF9',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  methodName: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: PALETTE.ink.charcoal,
  },
  methodSub: {
    fontFamily: FONTS.sans,
    fontSize: 10.5,
    color: PALETTE.ink.muted,
    marginTop: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: PALETTE.ink.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: PALETTE.bronze.base,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: PALETTE.bronze.base,
  },
  upiOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  upiPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    alignItems: 'center',
  },
  upiPillActive: {
    backgroundColor: PALETTE.bronze.base,
  },
  upiPillText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.ink.charcoal,
  },
  bankDirectPreviewBox: {
    backgroundColor: 'rgba(122, 82, 48, 0.06)',
    borderRadius: 14,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
  },
  bankDirectTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: PALETTE.bronze.base,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bankDirectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankDirectLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  bankDirectVal: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: PALETTE.ink.charcoal,
  },
  settleNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(122, 82, 48, 0.07)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  settleNoticeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.charcoal,
    flex: 1,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 18,
    paddingVertical: 14,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryActionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  errorText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#DC2626',
    textAlign: 'center',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  successText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#059669',
  },
  // Success Receipt View
  successContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successBadgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 22,
    color: PALETTE.ink.charcoal,
    textAlign: 'center',
  },
  successSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 16,
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    marginVertical: 4,
  },
  receiptLabel: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  receiptValue: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: PALETTE.ink.charcoal,
  },
  // Banking Management View
  bankingContainer: {
    width: '100%',
  },
  connectedBankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 82, 48, 0.14)',
    padding: 16,
    gap: 12,
  },
  bankCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.08)',
  },
  bankCardBankName: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: PALETTE.ink.charcoal,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    color: '#059669',
    letterSpacing: 0.5,
  },
  bankCardBody: {
    gap: 8,
  },
  bankFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankFieldLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: PALETTE.ink.muted,
  },
  bankFieldValue: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
  },
  editBankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    marginTop: 6,
  },
  editBankBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
  },
  bankFormContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.14)',
    padding: 16,
    gap: 12,
  },
  formHeading: {
    fontFamily: FONTS.serifBold,
    fontSize: 16,
    color: PALETTE.ink.charcoal,
    marginBottom: 4,
  },
  formField: {
    gap: 4,
  },
  inputLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.ink.charcoal,
  },
  formInput: {
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  formButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelFormBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
  },
  cancelFormBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: PALETTE.ink.muted,
  },
  saveBankBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: PALETTE.bronze.base,
  },
  saveBankBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  checkoutContainer: {
    width: '100%',
  },
});
