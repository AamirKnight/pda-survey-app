import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import EmptyState from '../components/ui/EmptyState';
import FilterChip from '../components/ui/FilterChip';
import SearchBar from '../components/ui/SearchBar';
import { ListSkeleton } from '../components/ui/Skeleton';
import SurveyCard from '../components/ui/SurveyCard';
import { colors, elevation, radius, spacing, tabBarClearance, typography } from '../theme/theme';

interface SurveyRecord {
  surveyId: string;
  surveyDate: string;
  propertyId: string | null;
  address: string;
  result: string;
  recommendation: string;
}

const PAST_SURVEYS: SurveyRecord[] = [
  {
    surveyId: 'SVY-2024-00891',
    surveyDate: '12 Jun 2025',
    propertyId: 'PDA-PRY-2021-00441',
    address: '14/3, Stanley Road, Civil Lines, Prayagraj',
    result: 'Verified',
    recommendation: 'No Action Required',
  },
  {
    surveyId: 'SVY-2024-00876',
    surveyDate: '10 Jun 2025',
    propertyId: 'PDA-PRY-2019-00887',
    address: '7A, Lowther Road, George Town, Prayagraj',
    result: 'Unauthorized Construction',
    recommendation: 'Challan Recommended',
  },
  {
    surveyId: 'SVY-2024-00843',
    surveyDate: '05 Jun 2025',
    propertyId: null,
    address: 'Near Triveni Marg, Phaphamau, Prayagraj',
    result: 'New Property Identified',
    recommendation: 'Warning Recommended',
  },
];

const FILTERS = ['All', 'Verified', 'Data Mismatch', 'Unauthorized Construction', 'New Property Identified'];

interface Props {
  navigation: any;
}

export default function SurveyHistoryScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SurveyRecord | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return PAST_SURVEYS.filter((s) => {
      const matchesSearch =
        s.surveyId.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.result.toLowerCase().includes(q);
      const matchesFilter = filter === 'All' || s.result === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  return (
    <View style={styles.container}>
      <Header title="Survey History" onMenuPress={() => navigation.openDrawer?.()} />

      <View style={styles.searchWrap}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search by ID, address, result…" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((item) => (
          <FilterChip key={item} label={item} selected={filter === item} onPress={() => setFilter(item)} />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.listPadding}>
          <ListSkeleton count={3} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.surveyId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No surveys found"
              description="Try a different search term or filter."
            />
          }
          renderItem={({ item }) => (
            <SurveyCard
              id={item.surveyId}
              address={item.address}
              meta={item.surveyDate}
              status={item.result}
              secondaryStatus={item.recommendation}
              primaryActionLabel="Details"
              onPrimaryAction={() => setSelected(item)}
              onPress={() => setSelected(item)}
            />
          )}
        />
      )}

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {selected && (
              <>
                <View style={styles.sheetHandle} />
                <View style={styles.sheetHeaderRow}>
                  <Text style={styles.sheetTitle}>{selected.surveyId}</Text>
                  <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                  </Pressable>
                </View>
                <DetailRow label="Date" value={selected.surveyDate} />
                <DetailRow label="Address" value={selected.address} />
                <DetailRow label="Result" value={selected.result} />
                <DetailRow label="Recommendation" value={selected.recommendation} />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  filterScroll: { marginTop: spacing.md, marginBottom: spacing.sm, flexGrow: 0 },
  filterContent: { paddingHorizontal: spacing.lg },
  listPadding: { padding: spacing.lg, paddingBottom: tabBarClearance },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    ...elevation.lg,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: { ...typography.h3, color: colors.textPrimary },
  detailRow: { marginBottom: spacing.md },
  detailLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: 2 },
  detailValue: { ...typography.bodyMedium, color: colors.textPrimary },
});