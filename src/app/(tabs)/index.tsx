import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, Pressable, ActivityIndicator, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { 
  Flame, 
  Calendar, 
  Plus, 
  TrendingUp, 
  ShoppingBag,
  Info,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  LogOut
} from 'lucide-react-native';
import { api } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../stores/auth';

export default function DashboardScreen() {
  const { signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-25'); // Preselección 25 de Mayo

  const { data: stats, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['stats', selectedDate],
    queryFn: () => api.getStats(selectedDate === 'all' ? undefined : selectedDate),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateDocenas = (batata: number, membrillo: number) => {
    const total = batata + membrillo;
    if (total === 0) return '0';
    const docenas = Math.floor(total / 12);
    const unidades = total % 12;
    if (unidades === 0) return `${docenas} doc.`;
    return `${docenas} doc. y ${unidades} un.`;
  };

  const datesList = [
    { label: '25 de Mayo', value: '2026-05-25' },
    { label: '1 de Mayo', value: '2026-05-01' },
    { label: 'Histórico', value: 'all' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Encabezado Editorial Apple-like */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>SISTEMA DE GESTIÓN</Text>
          <Text style={styles.headerTitle}>Resumen General</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable 
            onPress={() => refetch()} 
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.buttonPressed
            ]}
          >
            <RefreshCw size={18} color="#4A5568" />
          </Pressable>
          <Pressable 
            onPress={() => signOut()} 
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.buttonPressed
            ]}
          >
            <LogOut size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      {/* Selector de Evento / Fecha (Píldoras Flotantes) */}
      <View style={styles.selectorContainer}>
        {datesList.map((d) => (
          <Pressable
            key={d.value}
            onPress={() => setSelectedDate(d.value)}
            style={({ pressed }) => [
              styles.selectorChip,
              selectedDate === d.value && styles.selectorChipActive,
              pressed && styles.buttonPressed
            ]}
          >
            <Calendar 
              size={14} 
              color={selectedDate === d.value ? '#FFFFFF' : '#718096'} 
              style={{ marginRight: 6 }} 
            />
            <Text style={[
              styles.selectorChipText,
              selectedDate === d.value && styles.selectorChipTextActive
            ]}>
              {d.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <Text style={styles.loadingText}>Cargando resumen...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Info size={36} color="#EF4444" />
          <Text style={styles.errorText}>No se pudo establecer conexión con el servidor.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Reintentar Conexión</Text>
          </Pressable>
        </View>
      ) : stats ? (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" />
          }
        >
          {/* Tarjeta de Recaudación Principal (Double-Bezel Architecture) */}
          <View style={styles.doubleBezelOuter}>
            <View style={styles.doubleBezelInner}>
              <View style={styles.heroHeader}>
                <Text style={styles.heroLabel}>Total Recaudado</Text>
                <View style={styles.trendBadge}>
                  <TrendingUp size={12} color="#10B981" style={{ marginRight: 4 }} />
                  <Text style={styles.trendText}>Caja</Text>
                </View>
              </View>
              <Text style={styles.heroValue}>{formatCurrency(stats.recaudacion_total || 0)}</Text>
              
              <View style={styles.heroDivider} />
              
              <View style={styles.heroGrid}>
                {/* Cobrado */}
                <View style={styles.heroStatItem}>
                  <View style={styles.subStatHeader}>
                    <View style={[styles.subStatIndicator, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.heroStatLabel}>Cobrado</Text>
                  </View>
                  <Text style={[styles.heroStatValue, { color: '#10B981' }]}>
                    {formatCurrency(stats.recaudacion_cobrada || 0)}
                  </Text>
                </View>
                {/* Pendiente */}
                <View style={styles.heroStatItem}>
                  <View style={styles.subStatHeader}>
                    <View style={[styles.subStatIndicator, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.heroStatLabel}>Pendiente</Text>
                  </View>
                  <Text style={[styles.heroStatValue, { color: '#D97706' }]}>
                    {formatCurrency(stats.recaudacion_pendiente || 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cantidades de Productos */}
          <Text style={styles.sectionTitle}>Cantidades del Evento</Text>
          <View style={styles.statsGrid}>
            
            {/* Porciones de Locro */}
            <View style={styles.productCard}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FEF2F2' }]}>
                <Flame size={20} color="#EF4444" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productValue}>{stats.total_locro || 0}</Text>
                <Text style={styles.productLabel}>Locro (porciones)</Text>
              </View>
            </View>

            {/* Total Pastelitos */}
            <View style={styles.productCard}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FFFBEB' }]}>
                <ShoppingBag size={20} color="#F59E0B" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productValue}>
                  {calculateDocenas(stats.total_batata || 0, stats.total_membrillo || 0)}
                </Text>
                <Text style={styles.productLabel}>Pastelitos (total)</Text>
              </View>
            </View>
          </View>

          {/* Desglose de Pastelitos por Sabor */}
          <View style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>Pastelitos por Sabor</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.bulletGroup}>
                <View style={[styles.bullet, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.detailName}>Membrillo</Text>
              </View>
              <Text style={styles.detailValue}>{stats.total_membrillo || 0} un.</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.bulletGroup}>
                <View style={[styles.bullet, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.detailName}>Batata</Text>
              </View>
              <Text style={styles.detailValue}>{stats.total_batata || 0} un.</Text>
            </View>
          </View>

          {/* Total Pedidos Registrados */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryContent}>
              <CheckCircle size={18} color="#4F46E5" />
              <Text style={styles.summaryText}>Pedidos Registrados</Text>
            </View>
            <Text style={styles.summaryValue}>{stats.total_pedidos || 0}</Text>
          </View>

          {/* Accesos Rápidos */}
          <View style={styles.actionsContainer}>
            <Pressable 
              onPress={() => router.push('/pedidos/nuevo')}
              style={({ pressed }) => [
                styles.actionButton, 
                styles.actionPrimary, 
                pressed && styles.buttonPressed
              ]}
            >
              <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionButtonText}>Nuevo Pedido</Text>
            </Pressable>

            <Pressable 
              onPress={() => router.push('/envios')}
              style={({ pressed }) => [
                styles.actionButton, 
                styles.actionSecondary, 
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.actionButtonTextSecondary}>Ver Reparto</Text>
              <ChevronRight size={16} color="#4F46E5" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>

        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Fondo claro y cálido
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  selectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    gap: 10,
  },
  selectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  selectorChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  selectorChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  selectorChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Double-Bezel Architecture para la Tarjeta de Recaudación Principal
  doubleBezelOuter: {
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    padding: 6,
    marginTop: 14,
  },
  doubleBezelInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    color: '#137333',
    fontWeight: '700',
  },
  heroValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
    letterSpacing: -1,
  },
  heroDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  heroGrid: {
    flexDirection: 'row',
  },
  heroStatItem: {
    flex: 1,
  },
  subStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subStatIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  productLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  detailCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bulletGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  detailName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4F46E5',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionPrimary: {
    backgroundColor: '#4F46E5',
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtonTextSecondary: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  }
});
