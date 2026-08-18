import 'package:flutter/cupertino.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'services/supabase_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(url: supabaseUrl, publishableKey: supabasePublishableKey);
  runApp(const GatekeeperApp());
}

class GatekeeperApp extends StatefulWidget {
  const GatekeeperApp({super.key});

  @override
  State<GatekeeperApp> createState() => _GatekeeperAppState();
}

class _GatekeeperAppState extends State<GatekeeperApp> {
  bool get _signedIn => supabase.auth.currentSession != null;

  @override
  Widget build(BuildContext context) {
    return CupertinoApp(
      title: 'Gatekeeper',
      debugShowCheckedModeBanner: false,
      theme: const CupertinoThemeData(
        brightness: Brightness.light,
        primaryColor: CupertinoColors.black,
        scaffoldBackgroundColor: CupertinoColors.systemGroupedBackground,
      ),
      home: _signedIn
          ? HomeScreen(onSignedOut: () => setState(() {}))
          : LoginScreen(onSignedIn: () => setState(() {})),
    );
  }
}
