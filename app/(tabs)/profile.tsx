
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Platform, 
  Pressable, 
  Linking, 
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { Button } from "@/components/button";

export default function ProfileScreen() {
  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Choose how you'd like to contact us:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Email", 
          onPress: () => Linking.openURL('mailto:support@keberalerts.ke')
        },
        { 
          text: "Phone", 
          onPress: () => Linking.openURL('tel:+254700000000')
        }
      ]
    );
  };

  const handleReportMissingChild = () => {
    Alert.alert(
      "Report Missing Child",
      "To report a missing child, please contact the police immediately at 999 or visit your nearest police station.",
      [
        { text: "OK" },
        { 
          text: "Call 999", 
          onPress: () => Linking.openURL('tel:999')
        }
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      "Share App",
      "Help spread awareness by sharing this app with friends and family.",
      [{ text: "OK" }]
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Settings", "App settings coming soon")}
      style={{ padding: 6 }}
    >
      <IconSymbol name="gear" color={colors.text} size={24} />
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Information & Support",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerRight: renderHeaderRight,
          }}
        />
      )}
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={commonStyles.card}>
          <View style={[commonStyles.row, { justifyContent: 'center', marginBottom: 8 }]}>
            <IconSymbol name="info.circle.fill" size={32} color={colors.accent} />
            <Text style={[commonStyles.title, { marginLeft: 12, marginBottom: 0 }]}>
              About KEBER Alerts
            </Text>
          </View>
          <Text style={[commonStyles.textSecondary, commonStyles.centerText]}>
            Learn how you can help bring missing children home
          </Text>
        </View>

        {/* What is KEBER Alert */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>What is a KEBER Alert?</Text>
          <Text style={commonStyles.text}>
            KEBER (Kenya Emergency Broadcast Emergency Response) Alert is an emergency response system that disseminates information about missing children who are believed to be in imminent danger.
          </Text>
          <Text style={commonStyles.text}>
            The system was created to help law enforcement agencies and communities work together to find abducted children quickly and safely.
          </Text>
        </View>

        {/* How it Works */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>How KEBER Alerts Work in Kenya</Text>
          <View style={commonStyles.row}>
            <IconSymbol name="1.circle.fill" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>
              Police confirm a child abduction has occurred
            </Text>
          </View>
          <View style={commonStyles.row}>
            <IconSymbol name="2.circle.fill" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>
              Alert is issued with child's information and description
            </Text>
          </View>
          <View style={commonStyles.row}>
            <IconSymbol name="3.circle.fill" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>
              Alert is broadcast to mobile devices and media
            </Text>
          </View>
          <View style={commonStyles.row}>
            <IconSymbol name="4.circle.fill" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>
              Public helps search and reports sightings to police
            </Text>
          </View>
        </View>

        {/* What to Do */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>What to Do When You Receive an Alert</Text>
          <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
            <IconSymbol name="eye.fill" size={20} color={colors.secondary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Look Carefully
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Pay attention to the child's description, clothing, and any vehicle information
              </Text>
            </View>
          </View>
          
          <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
            <IconSymbol name="phone.fill" size={20} color={colors.secondary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Call Immediately
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                If you see the child or suspect vehicle, call 999 immediately
              </Text>
            </View>
          </View>
          
          <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
            <IconSymbol name="square.and.arrow.up.fill" size={20} color={colors.secondary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                Share the Alert
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Share the alert with friends and family to increase visibility
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>KEBER Alert Success</Text>
          <Text style={commonStyles.text}>
            Since its inception, KEBER Alerts have helped recover thousands of missing children worldwide. The system's success depends on community participation and quick response times.
          </Text>
          <View style={[commonStyles.row, { justifyContent: 'space-around', marginTop: 16 }]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.title, { color: colors.primary, marginBottom: 4 }]}>
                1000+
              </Text>
              <Text style={[commonStyles.textSecondary, commonStyles.centerText]}>
                Children Recovered
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.title, { color: colors.secondary, marginBottom: 4 }]}>
                95%
              </Text>
              <Text style={[commonStyles.textSecondary, commonStyles.centerText]}>
                Success Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Take Action</Text>
          
          <View style={{ marginBottom: 12 }}>
            <Button
              onPress={handleReportMissingChild}
              variant="primary"
            >
              Report Missing Child
            </Button>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Button
              onPress={handleShareApp}
              variant="secondary"
            >
              Share This App
            </Button>
          </View>
          
          <Button
            onPress={handleContactSupport}
            variant="outline"
          >
            Contact Support
          </Button>
        </View>

        {/* Emergency Contacts */}
        <View style={[commonStyles.card, { marginBottom: 100 }]}>
          <Text style={commonStyles.subtitle}>Emergency Contacts</Text>
          
          <Pressable 
            onPress={() => Linking.openURL('tel:999')}
            style={[commonStyles.row, { padding: 12, backgroundColor: colors.background, borderRadius: 8, marginBottom: 8 }]}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.danger} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { marginBottom: 0, fontWeight: '600' }]}>
                Police Emergency
              </Text>
              <Text style={commonStyles.textSecondary}>999</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable 
            onPress={() => Linking.openURL('tel:116')}
            style={[commonStyles.row, { padding: 12, backgroundColor: colors.background, borderRadius: 8, marginBottom: 8 }]}
          >
            <IconSymbol name="phone.fill" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { marginBottom: 0, fontWeight: '600' }]}>
                Child Helpline Kenya
              </Text>
              <Text style={commonStyles.textSecondary}>116</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable 
            onPress={() => Linking.openURL('tel:+254700000000')}
            style={[commonStyles.row, { padding: 12, backgroundColor: colors.background, borderRadius: 8 }]}
          >
            <IconSymbol name="envelope.fill" size={20} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { marginBottom: 0, fontWeight: '600' }]}>
                KEBER Alert Support
              </Text>
              <Text style={commonStyles.textSecondary}>support@keberalerts.ke</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
