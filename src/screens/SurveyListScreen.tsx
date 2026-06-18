import { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import EmptyState from '../components/ui/EmptyState';
import FilterChip from '../components/ui/FilterChip';
import SearchBar from '../components/ui/SearchBar';
import { ListSkeleton } from '../components/ui/Skeleton';
import SurveyCard from '../components/ui/SurveyCard';
import { colors, spacing, tabBarClearance } from '../theme/theme';

interface RegisteredProperty {
  propertyId: string;
  ownerName: string;
  address: string;
  landmark: string;
  natureOfConstruction: string;
  status: 'Active' | 'Under Review';
}

const REGISTERED_PROPERTIES: RegisteredProperty[] = [
  {
    propertyId: 'PDA-PRY-2021-00441',
    ownerName: 'Ramesh Chandra Gupta',
    address: '14/3, Stanley Road, Civil Lines, Prayagraj - 211001',
    landmark: 'Near Alfred Park Gate No. 2',
    natureOfConstruction: 'Residential',
    status: 'Active',
  },
  {
    propertyId: 'PDA-PRY-2019-00887',
    ownerName: 'Meena Tiwari',
    address: '7A, Lowther Road, George Town, Prayagraj - 211002',
    landmark: 'Opposite High Court Gate 3',
    natureOfConstruction: 'Commercial',
    status: 'Active',
  },
  {
    propertyId: 'PDA-PRY-2020-01123',
    ownerName: 'Hari Prasad Yadav',
    address: '55, Elgin Road, Allahpur, Prayagraj - 211006',
    landmark: 'Near Allahpur Market Circle',
    natureOfConstruction: 'Residential',
    status: 'Under Review',
  },
  {
    propertyId: 'PDA-PRY-2022-00334',
    ownerName: 'Priya Singh Chauhan',
    address: '19, Thornhill Road, Prayagraj - 211001',
    landmark: 'Behind Muir Central College',
    natureOfConstruction: 'Residential',
    status: 'Active',
  },
  {
    propertyId: 'PDA-PRY-2018-00229',
    ownerName: 'Mohammad Azhar Khan',
    address: 'Plot 8, Kareli Bazar, Prayagraj - 211016',
    landmark: 'Near Kareli Police Chowki',
    natureOfConstruction: 'Commercial',
    status: 'Active',
  },
];

const FILTERS = ['All', 'Active', 'Under Review'];

interface Props {
  navigation: any;
}

export default function SurveyListScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return REGISTERED_PROPERTIES.filter((p) => {
      const matchesSearch =
        p.propertyId.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);
      const matchesFilter = filter === 'All' || p.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  return (
    <View style={styles.container}>
      <Header title="Registered Properties" onMenuPress={() => navigation.openDrawer?.()} />

      <View style={styles.searchWrap}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search by ID, owner, address…" />
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
          <ListSkeleton count={4} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.propertyId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
          ListEmptyComponent={
            <EmptyState
              icon="home-outline"
              title="No properties found"
              description="Try a different search term or filter."
            />
          }
          renderItem={({ item }) => (
            <SurveyCard
              id={item.propertyId}
              subtitle={item.ownerName}
              address={item.address}
              status={item.status}
              secondaryStatus={item.natureOfConstruction}
              primaryActionLabel="Verify"
              onPrimaryAction={() =>
                navigation.navigate('PropertyVerification', { propertyId: item.propertyId, isNew: false })
              }
              onPress={() =>
                navigation.navigate('PropertyVerification', { propertyId: item.propertyId, isNew: false })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  filterScroll: { marginTop: spacing.md, marginBottom: spacing.sm, flexGrow: 0 },
  filterContent: { paddingHorizontal: spacing.lg },
  listPadding: { padding: spacing.lg, paddingBottom: tabBarClearance },
});