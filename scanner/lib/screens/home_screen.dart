import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart' show LinearProgressIndicator;
import '../services/supabase_service.dart';
import 'scan_screen.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onSignedOut;
  const HomeScreen({super.key, required this.onSignedOut});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<OrgSummary>> _orgsFuture;
  late Future<List<RecentScan>> _recentFuture;
  String _staffName = '';

  @override
  void initState() {
    super.initState();
    _load();
    _loadStaffName();
  }

  void _load() {
    _orgsFuture = fetchOrgSummaries();
    _recentFuture = fetchRecentScans();
  }

  Future<void> _loadStaffName() async {
    final userId = supabase.auth.currentUser?.id;
    if (userId == null) return;
    final row = await supabase.from('staff').select('name').eq('id', userId).maybeSingle();
    if (mounted && row != null) setState(() => _staffName = row['name'] as String? ?? '');
  }

  Future<void> _refresh() async {
    setState(_load);
    await Future.wait([_orgsFuture, _recentFuture]);
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: CupertinoColors.systemGroupedBackground,
      child: SafeArea(
        child: CustomScrollView(
          slivers: [
            CupertinoSliverRefreshControl(onRefresh: _refresh),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  _buildHeader(),
                  const SizedBox(height: 24),
                  _buildScanCard(context),
                  const SizedBox(height: 28),
                  const Text(
                    'Attendance by Organization',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, letterSpacing: -0.3),
                  ),
                  const SizedBox(height: 12),
                  _buildOrgSummaries(),
                  const SizedBox(height: 28),
                  const Text(
                    'Recent Check-ins',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, letterSpacing: -0.3),
                  ),
                  const SizedBox(height: 12),
                  _buildRecentScans(),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Gatekeeper',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, letterSpacing: -0.6),
            ),
            if (_staffName.isNotEmpty)
              Text(_staffName, style: const TextStyle(fontSize: 15, color: CupertinoColors.secondaryLabel)),
          ],
        ),
        GestureDetector(
          onTap: () async {
            await supabase.auth.signOut();
            widget.onSignedOut();
          },
          child: Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: CupertinoColors.white, borderRadius: BorderRadius.circular(14)),
            child: const Icon(CupertinoIcons.square_arrow_right, size: 20, color: CupertinoColors.systemRed),
          ),
        ),
      ],
    );
  }

  Widget _buildScanCard(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        await Navigator.of(context).push(CupertinoPageRoute(builder: (_) => const ScanScreen()));
        _refresh();
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: CupertinoColors.black,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(color: CupertinoColors.white, borderRadius: BorderRadius.circular(16)),
              alignment: Alignment.center,
              child: const Icon(CupertinoIcons.qrcode_viewfinder, color: CupertinoColors.black, size: 26),
            ),
            const SizedBox(width: 16),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Scan QR Code',
                    style: TextStyle(color: CupertinoColors.white, fontSize: 19, fontWeight: FontWeight.w700),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Check guests in at the gate',
                    style: TextStyle(color: CupertinoColors.systemGrey, fontSize: 14),
                  ),
                ],
              ),
            ),
            const Icon(CupertinoIcons.chevron_forward, color: CupertinoColors.systemGrey, size: 18),
          ],
        ),
      ),
    );
  }

  Widget _buildOrgSummaries() {
    return FutureBuilder<List<OrgSummary>>(
      future: _orgsFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: CupertinoActivityIndicator()),
          );
        }
        final orgs = snapshot.data!;
        if (orgs.isEmpty) {
          return _emptyCard('No organizations yet.');
        }
        return Column(
          children: orgs
              .map(
                (org) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: CupertinoColors.white, borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(org.orgName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                          Text(
                            '${org.checkedInCount} / ${org.allocatedSeats}',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: CupertinoColors.activeGreen,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: org.allocatedSeats > 0 ? (org.checkedInCount / org.allocatedSeats).clamp(0, 1) : 0,
                          minHeight: 6,
                          backgroundColor: CupertinoColors.systemGrey5,
                          valueColor: const AlwaysStoppedAnimation(CupertinoColors.activeGreen),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${org.submittedCount} submitted',
                        style: const TextStyle(fontSize: 12, color: CupertinoColors.secondaryLabel),
                      ),
                    ],
                  ),
                ),
              )
              .toList(),
        );
      },
    );
  }

  Widget _buildRecentScans() {
    return FutureBuilder<List<RecentScan>>(
      future: _recentFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: CupertinoActivityIndicator()),
          );
        }
        final scans = snapshot.data!;
        if (scans.isEmpty) {
          return _emptyCard('No scans yet.');
        }
        return Container(
          decoration: BoxDecoration(color: CupertinoColors.white, borderRadius: BorderRadius.circular(16)),
          child: Column(
            children: scans.asMap().entries.map((entry) {
              final scan = entry.value;
              final isLast = entry.key == scans.length - 1;
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  border: isLast
                      ? null
                      : const Border(bottom: BorderSide(color: CupertinoColors.systemGrey5, width: 0.5)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            scan.guestName ?? (scan.isWalkin ? 'Walk-in Guest' : 'Guest'),
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                          ),
                          Text(
                            [
                              if (scan.orgName != null) scan.orgName!,
                              if (scan.gate != null) scan.gate!,
                            ].join(' · '),
                            style: const TextStyle(fontSize: 12, color: CupertinoColors.secondaryLabel),
                          ),
                        ],
                      ),
                    ),
                    _statusPill(scan.result),
                  ],
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }

  Widget _statusPill(String result) {
    final Color color = switch (result) {
      'success' => CupertinoColors.activeGreen,
      'duplicate' => CupertinoColors.systemOrange,
      _ => CupertinoColors.systemRed,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(20)),
      child: Text(
        result.replaceAll('_', ' '),
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color),
      ),
    );
  }

  Widget _emptyCard(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(color: CupertinoColors.white, borderRadius: BorderRadius.circular(16)),
      alignment: Alignment.center,
      child: Text(message, style: const TextStyle(color: CupertinoColors.secondaryLabel, fontSize: 14)),
    );
  }
}
