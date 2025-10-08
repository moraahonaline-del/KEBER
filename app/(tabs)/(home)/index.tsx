
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  View, 
  Text, 
  Alert, 
  Platform, 
  Pressable,
  Image,
  RefreshControl,
  Linking
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from 'expo-notifications';
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/button";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Mock data for keber alerts
const mockAlerts = [
  {
    id: '1',
    type: 'KEBER_ALERT',
    title: 'KEBER Alert - Missing Child',
    childName: 'Sarah Wanjiku',
    age: 8,
    description: 'Missing from Nairobi CBD area. Last seen wearing a blue school uniform.',
    lastSeen: 'Nairobi CBD, near Uhuru Park',
    timeIssued: '2 hours ago',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    isUrgent: true,
    contactNumber: '+254700123456',
    caseNumber: 'KE-2024-001'
  },
  {
    id: '2',
    type: 'KEBER_ALERT',
    title: 'KEBER Alert - Missing Child',
    childName: 'John Kamau',
    age: 12,
    description: 'Missing from Mombasa. Last seen wearing red t-shirt and blue jeans.',
    lastSeen: 'Mombasa, Nyali area',
    timeIssued: '6 hours ago',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    isUrgent: false,
    contactNumber: '+254700654321',
    caseNumber: 'KE-2024-002'
  }
];

export default function HomeScreen() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>('unknown');

  useEffect(() => {
    checkNotificationPermissions();
    setupNotificationListeners();
  }, []);

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermission(status);
      
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        setNotificationPermission(newStatus);
      }
    } catch (error) {
      console.log('Error checking notification permissions:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Listen for notifications received while app is running
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification interactions
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate fetching new alerts
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCallPolice = (contactNumber: string) => {
    Alert.alert(
      "Call Police",
      `Do you want to call ${contactNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Call", 
          onPress: () => {
            Linking.openURL(`tel:${contactNumber}`);
          }
        }
      ]
    );
  };

  const handleReportSighting = (alert: any) => {
    Alert.alert(
      "Report Sighting",
      `Report a sighting of ${alert.childName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Report", 
          style: "default",
          onPress: () => {
            Alert.alert(
              "Thank You",
              "Your sighting report has been submitted to authorities. Please call the police immediately if you see this child.",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  const renderAlert = (alert: any) => (
    <View 
      key={alert.id} 
      style={alert.isUrgent ? commonStyles.urgentAlertCard : commonStyles.alertCard}
    >
      {/* Alert Header */}
      <View style={commonStyles.row}>
        <IconSymbol 
          name="exclamationmark.triangle.fill" 
          size={24} 
          color={alert.isUrgent ? colors.danger : colors.primary} 
        />
        <Text style={[commonStyles.subtitle, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>
          {alert.title}
        </Text>
        {alert.isUrgent && (
          <View style={[commonStyles.badge, { backgroundColor: colors.danger }]}>
            <Text style={commonStyles.badgeText}>URGENT</Text>
          </View>
        )}
      </View>

      {/* Child Information */}
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Image 
          source={{ uri: alert.photo }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            marginRight: 16
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
            {alert.childName}, Age {alert.age}
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
            Case: {alert.caseNumber}
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
            Issued: {alert.timeIssued}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={[commonStyles.text, { marginTop: 12 }]}>
        {alert.description}
      </Text>

      {/* Last Seen */}
      <View style={[commonStyles.row, { marginTop: 8 }]}>
        <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 4, marginBottom: 0 }]}>
          Last seen: {alert.lastSeen}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => handleCallPolice(alert.contactNumber)}
            variant="primary"
            size="small"
          >
            Call Police
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => handleReportSighting(alert)}
            variant="secondary"
            size="small"
          >
            Report Sighting
          </Button>
        </View>
      </View>
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Information", "This app helps distribute KEBER alerts for missing children in Kenya. Enable notifications to receive immediate alerts.")}
      style={{ padding: 6 }}
    >
      <IconSymbol name="info.circle" color={colors.text} size={24} />
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "KEBER Alerts Kenya",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerRight: renderHeaderRight,
          }}
        />
      )}
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={commonStyles.card}>
          <View style={[commonStyles.row, { justifyContent: 'center', marginBottom: 8 }]}>
            <IconSymbol name="shield.fill" size={32} color={colors.primary} />
            <Text style={[commonStyles.title, { marginLeft: 12, marginBottom: 0 }]}>
              KEBER Alerts Kenya
            </Text>
          </View>
          <Text style={[commonStyles.textSecondary, commonStyles.centerText]}>
            Helping bring missing children home safely
          </Text>
          
          {notificationPermission !== 'granted' && (
            <View style={{ marginTop: 12, padding: 12, backgroundColor: colors.highlight, borderRadius: 8 }}>
              <Text style={[commonStyles.textSecondary, commonStyles.centerText]}>
                Enable notifications to receive immediate alerts
              </Text>
            </View>
          )}
        </View>

        {/* Active Alerts Section */}
        <View style={{ marginTop: 8 }}>
          <View style={commonStyles.row}>
            <Text style={commonStyles.subtitle}>Active Alerts</Text>
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{alerts.length}</Text>
            </View>
          </View>
          
          {alerts.length === 0 ? (
            <View style={commonStyles.card}>
              <View style={{ alignItems: 'center', padding: 20 }}>
                <IconSymbol name="checkmark.circle.fill" size={48} color={colors.secondary} />
                <Text style={[commonStyles.text, commonStyles.centerText, { marginTop: 12 }]}>
                  No active alerts at this time
                </Text>
                <Text style={[commonStyles.textSecondary, commonStyles.centerText]}>
                  We'll notify you immediately if any alerts are issued
                </Text>
              </View>
            </View>
          ) : (
            alerts.map(renderAlert)
          )}
        </View>

        {/* Information Section */}
        <View style={[commonStyles.card, { marginTop: 16 }]}>
          <Text style={commonStyles.subtitle}>How KEBER Alerts Work</Text>
          <Text style={commonStyles.text}>
            • Alerts are issued when a child is abducted and in imminent danger
          </Text>
          <Text style={commonStyles.text}>
            • You'll receive immediate notifications on your device
          </Text>
          <Text style={commonStyles.text}>
            • If you see the missing child, call police immediately
          </Text>
          <Text style={commonStyles.text}>
            • Share alerts with others to increase visibility
          </Text>
        </View>

        {/* Emergency Contact */}
        <View style={[commonStyles.card, { marginTop: 16, marginBottom: 100 }]}>
          <Text style={commonStyles.subtitle}>Emergency Contacts</Text>
          <Pressable 
            onPress={() => handleCallPolice('999')}
            style={[commonStyles.row, { padding: 12, backgroundColor: colors.background, borderRadius: 8 }]}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.danger} />
            <Text style={[commonStyles.text, { marginLeft: 8, marginBottom: 0, color: colors.danger }]}>
              Police Emergency: 999
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => handleCallPolice('116')}
            style={[commonStyles.row, { padding: 12, backgroundColor: colors.background, borderRadius: 8, marginTop: 8 }]}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, marginBottom: 0, color: colors.primary }]}>
              Child Helpline: 116
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
