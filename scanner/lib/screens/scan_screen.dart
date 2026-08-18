import 'package:flutter/cupertino.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/supabase_service.dart';

class ScanScreen extends StatefulWidget {
  final VoidCallback onSignedOut;
  const ScanScreen({super.key, required this.onSignedOut});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final _controller = MobileScannerController();
  bool _busy = false;
  ScanResult? _result;
  String? _errorMessage;
  String _gate = 'Main Gate';

  @override
  void initState() {
    super.initState();
    _loadGate();
  }

  Future<void> _loadGate() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() => _gate = prefs.getString('gate_name') ?? 'Main Gate');
  }

  Future<void> _saveGate(String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('gate_name', value);
    setState(() => _gate = value);
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_busy) return;
    final code = capture.barcodes.firstOrNull?.rawValue;
    if (code == null) return;

    setState(() {
      _busy = true;
      _result = null;
      _errorMessage = null;
    });

    try {
      final result = await redeemTicket(code, _gate);
      setState(() => _result = result);
    } catch (e) {
      setState(() => _errorMessage = e is RedeemException ? e.message : 'Invalid QR code');
    }

    await Future.delayed(const Duration(milliseconds: 2200));
    if (mounted) {
      setState(() {
        _busy = false;
        _result = null;
        _errorMessage = null;
      });
    }
  }

  void _showGateSettings() {
    final controller = TextEditingController(text: _gate);
    showCupertinoModalPopup(
      context: context,
      builder: (context) => CupertinoActionSheet(
        title: const Text('Gate Name'),
        message: Padding(
          padding: const EdgeInsets.only(top: 12),
          child: CupertinoTextField(
            controller: controller,
            autofocus: true,
            textAlign: TextAlign.center,
          ),
        ),
        actions: [
          CupertinoActionSheetAction(
            onPressed: () {
              _saveGate(controller.text.trim().isEmpty ? 'Main Gate' : controller.text.trim());
              Navigator.pop(context);
            },
            child: const Text('Save'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
      ),
    );
  }

  Color get _overlayColor {
    if (_errorMessage != null) return CupertinoColors.systemRed;
    if (_result == null) return CupertinoColors.black;
    if (_result!.ok) return CupertinoColors.systemGreen;
    if (_result!.reason == 'duplicate') return CupertinoColors.systemOrange;
    return CupertinoColors.systemRed;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final showingOverlay = _result != null || _errorMessage != null;

    return CupertinoPageScaffold(
      backgroundColor: CupertinoColors.black,
      child: Stack(
        children: [
          MobileScanner(controller: _controller, onDetect: _onDetect),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [CupertinoColors.black.withValues(alpha: 0.6), CupertinoColors.black.withValues(alpha: 0.0)],
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: _showGateSettings,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: CupertinoColors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(_gate, style: const TextStyle(color: CupertinoColors.white, fontSize: 14, fontWeight: FontWeight.w600)),
                    ),
                  ),
                  GestureDetector(
                    onTap: () async {
                      await supabase.auth.signOut();
                      widget.onSignedOut();
                    },
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: CupertinoColors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(CupertinoIcons.square_arrow_right, color: CupertinoColors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (showingOverlay)
            AnimatedOpacity(
              opacity: 1,
              duration: const Duration(milliseconds: 150),
              child: Container(
                color: _overlayColor.withValues(alpha: 0.94),
                child: SafeArea(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            _errorMessage != null || (_result != null && !_result!.ok)
                                ? (_result?.reason == 'duplicate' ? CupertinoIcons.arrow_2_circlepath : CupertinoIcons.xmark_circle_fill)
                                : CupertinoIcons.checkmark_circle_fill,
                            color: CupertinoColors.white,
                            size: 72,
                          ),
                          const SizedBox(height: 20),
                          if (_result != null) ...[
                            Text(
                              _result!.guestName ?? (_result!.isWalkin ? 'Walk-in Guest' : 'Guest'),
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w700, color: CupertinoColors.white),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              [
                                if (_result!.orgName != null) _result!.orgName!,
                                if (_result!.tableLabel != null) 'Table ${_result!.tableLabel}',
                              ].join(' · '),
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 16, color: CupertinoColors.white),
                            ),
                            const SizedBox(height: 14),
                            Text(
                              _statusLabel(_result!.reason),
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: CupertinoColors.white),
                            ),
                          ] else
                            Text(
                              _errorMessage ?? 'Unknown error',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: CupertinoColors.white),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  String _statusLabel(String reason) {
    switch (reason) {
      case 'success':
        return 'CHECKED IN';
      case 'duplicate':
        return 'ALREADY CHECKED IN';
      case 'revoked':
        return 'TICKET REVOKED';
      case 'not_found':
        return 'TICKET NOT FOUND';
      default:
        return reason.toUpperCase();
    }
  }
}

extension _FirstOrNull<T> on List<T> {
  T? get firstOrNull => isEmpty ? null : first;
}
