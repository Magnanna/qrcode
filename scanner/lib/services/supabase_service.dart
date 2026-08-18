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
