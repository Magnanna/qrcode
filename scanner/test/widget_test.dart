import 'package:flutter_test/flutter_test.dart';
import 'package:scanner/services/supabase_service.dart';

void main() {
  test('ScanResult.fromJson parses a successful redemption', () {
    final result = ScanResult.fromJson({
      'ok': true,
      'reason': 'success',
      'guest': {'name': 'Jane Doe', 'is_walkin': false},
      'organization': {'name': 'KWS'},
      'event_table': {'label': 'A1'},
    });

    expect(result.ok, true);
    expect(result.guestName, 'Jane Doe');
    expect(result.orgName, 'KWS');
    expect(result.tableLabel, 'A1');
  });
}
