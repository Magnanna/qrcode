import 'package:supabase_flutter/supabase_flutter.dart';

const supabaseUrl = 'https://kvfctwknsnaazlpavsbp.supabase.co';
const supabasePublishableKey = 'sb_publishable_WiVkxA1Hrd5se-eVt_-nOA_EzftxHCw';

SupabaseClient get supabase => Supabase.instance.client;

class ScanResult {
  final bool ok;
  final String reason;
  final String? guestName;
  final bool isWalkin;
  final String? orgName;
  final String? tableLabel;

  ScanResult({
    required this.ok,
    required this.reason,
    this.guestName,
    this.isWalkin = false,
    this.orgName,
    this.tableLabel,
  });

  factory ScanResult.fromJson(Map<String, dynamic> json) {
    final guest = json['guest'] as Map<String, dynamic>?;
    final org = json['organization'] as Map<String, dynamic>?;
    final table = json['event_table'] as Map<String, dynamic>?;

    return ScanResult(
      ok: json['ok'] == true,
      reason: json['reason'] as String? ?? 'unknown',
      guestName: guest?['name'] as String?,
      isWalkin: guest?['is_walkin'] == true,
      orgName: org?['name'] as String?,
      tableLabel: table?['label'] as String?,
    );
  }
}

class RedeemException implements Exception {
  final String message;
  RedeemException(this.message);
  @override
  String toString() => message;
}

Future<ScanResult> redeemTicket(String token, String? gate) async {
  try {
    final data = await supabase.rpc(
      'redeem_ticket',
      params: {'p_token': token, 'p_gate': gate},
    );
    return ScanResult.fromJson(data as Map<String, dynamic>);
  } on PostgrestException catch (e) {
    throw RedeemException(e.message);
  } catch (e) {
    throw RedeemException('Invalid QR code');
  }
}

class OrgSummary {
  final String orgId;
  final String orgName;
  final int allocatedSeats;
  final int submittedCount;
  final int checkedInCount;

  OrgSummary({
    required this.orgId,
    required this.orgName,
    required this.allocatedSeats,
    required this.submittedCount,
    required this.checkedInCount,
  });

  factory OrgSummary.fromJson(Map<String, dynamic> json) => OrgSummary(
    orgId: json['org_id'] as String,
    orgName: json['org_name'] as String,
    allocatedSeats: json['allocated_seats'] as int,
    submittedCount: json['submitted_count'] as int,
    checkedInCount: json['checked_in_count'] as int,
  );
}

Future<List<OrgSummary>> fetchOrgSummaries() async {
  final data = await supabase.from('org_attendance_summary').select();
  return (data as List).map((row) => OrgSummary.fromJson(row as Map<String, dynamic>)).toList();
}

class RecentScan {
  final String id;
  final String result;
  final String? gate;
  final DateTime createdAt;
  final String? guestName;
  final bool isWalkin;
  final String? orgName;

  RecentScan({
    required this.id,
    required this.result,
    required this.gate,
    required this.createdAt,
    this.guestName,
    this.isWalkin = false,
    this.orgName,
  });

  factory RecentScan.fromJson(Map<String, dynamic> json) {
    final guest = json['guests'] as Map<String, dynamic>?;
    final org = guest?['organizations'] as Map<String, dynamic>?;
    return RecentScan(
      id: json['id'] as String,
      result: json['result'] as String,
      gate: json['gate'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      guestName: guest?['name'] as String?,
      isWalkin: guest?['is_walkin'] == true,
      orgName: org?['name'] as String?,
    );
  }
}

Future<List<RecentScan>> fetchRecentScans({int limit = 20}) async {
  final data = await supabase
      .from('scan_events')
      .select('id, result, gate, created_at, guests(name, is_walkin, organizations(name))')
      .order('created_at', ascending: false)
      .limit(limit);
  return (data as List).map((row) => RecentScan.fromJson(row as Map<String, dynamic>)).toList();
}
