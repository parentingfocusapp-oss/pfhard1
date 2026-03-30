import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Button, Linking, Pressable, ScrollView, Share, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { createSessionReport, createSessionReportText } from "../lib/report";
import { sessionRepository } from "../lib/storage";
import { SessionReport } from "../types/report";

export default function ReportScreen() {
  const [reports, setReports] = useState<SessionReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      const sessions = await sessionRepository.getAllSessions();
      setReports(sessions.map((session) => createSessionReport(session)));
      setIsLoading(false);
    }

    void loadReports();
  }, []);

  const combinedReportText = useMemo(() => {
    if (reports.length === 0) return "";
    return reports.map(createSessionReportText).join("\n\n---\n\n");
  }, [reports]);

  async function shareSingleReport(report: SessionReport) {
    await Share.share({
      title: `Session Report ${report.anonymizedSessionId}`,
      message: createSessionReportText(report),
    });
  }

  async function shareAllReports() {
    if (!combinedReportText) return;
    await Share.share({
      title: "All Session Reports",
      message: combinedReportText,
    });
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 40,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12, color: WarmTheme.text }}>
        Session reports
      </Text>

      <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
        Reports use anonymized session IDs and include what was discussed plus
        the agreed experiment.
      </Text>

      {isLoading ? <Text style={{ marginBottom: 16, color: WarmTheme.text }}>Loading reports...</Text> : null}

      {!isLoading && reports.length === 0 ? (
        <Text style={{ marginBottom: 24, color: WarmTheme.mutedText }}>
          No completed sessions yet. Finish one session to generate your first
          report.
        </Text>
      ) : null}

      {reports.length > 0 ? (
        <>
          <Button title="Share all reports" onPress={() => void shareAllReports()} />
          <View style={{ height: 16 }} />
        </>
      ) : null}

      {reports.map((report) => (
        <View
          key={`${report.anonymizedSessionId}-${report.createdAt}`}
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 10,
            padding: 14,
            marginBottom: 14,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 6, color: WarmTheme.text }}>
            {report.anonymizedSessionId}
          </Text>
          <Text style={{ marginBottom: 6, color: WarmTheme.mutedText }}>
            Date: {new Date(report.createdAt).toLocaleString()}
          </Text>
          <Text style={{ marginBottom: 6, color: WarmTheme.mutedText }}>Route: {report.routeType}</Text>
          <Text style={{ marginBottom: 6, color: WarmTheme.mutedText }}>Discussed: {report.discussed}</Text>
          <Text style={{ marginBottom: 6, color: WarmTheme.mutedText }}>
            Agreed experiment: {report.agreedExperiment}
          </Text>
          {report.experimentSourceName ? (
            <Text style={{ marginBottom: 6, color: WarmTheme.mutedText }}>
              {report.experimentSourceCitation
                ? `Based on ${report.experimentSourceCitation}`
                : `Based on guidance from ${report.experimentSourceName}`}
            </Text>
          ) : null}
          {report.experimentSourceUrl ? (
            <Pressable
              onPress={() => {
                void Linking.openURL(report.experimentSourceUrl!);
              }}
              style={{ marginBottom: 6, alignSelf: "flex-start" }}
            >
              <Text style={{ color: WarmTheme.accent, fontWeight: "600" }}>See more</Text>
            </Pressable>
          ) : null}
          <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
            Follow-up: {report.followUpStatus}
          </Text>

          <Button
            title="Share this report"
            onPress={() => void shareSingleReport(report)}
          />
        </View>
      ))}

      <View style={{ height: 8 }} />
      <Button title="Back" onPress={() => router.back()} />
    </ScrollView>
  );
}
