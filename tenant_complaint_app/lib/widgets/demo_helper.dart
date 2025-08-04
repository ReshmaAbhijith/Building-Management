import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../config/app_config.dart';
import '../services/service_factory.dart';

class DemoHelper extends StatelessWidget {
  const DemoHelper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (!ServiceFactory.isDemoMode()) {
      return const SizedBox.shrink(); // Don't show in production mode
    }

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        border: Border.all(color: Colors.orange.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Icon(Icons.info_outline, color: Colors.orange.shade700),
              const SizedBox(width: 8),
              Text(
                '🎭 Demo Mode Active',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.orange.shade700,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'This app is running in demo mode with sample data. No server connection required.',
            style: TextStyle(color: Colors.orange.shade800),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Demo Credentials:',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 8),
                _buildCredentialRow(
                  'Email:', 
                  AppConfig.demoTenantEmail,
                  context,
                ),
                const SizedBox(height: 4),
                _buildCredentialRow(
                  'Password:', 
                  AppConfig.demoPassword,
                  context,
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tap on credentials to copy them to clipboard.',
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCredentialRow(String label, String value, BuildContext context) {
    return Row(
      children: [
        SizedBox(
          width: 70,
          child: Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.grey.shade700,
            ),
          ),
        ),
        Expanded(
          child: GestureDetector(
            onTap: () {
              Clipboard.setData(ClipboardData(text: value));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('$label copied to clipboard'),
                  duration: const Duration(seconds: 2),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      value,
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 13,
                      ),
                    ),
                  ),
                  Icon(
                    Icons.copy,
                    size: 16,
                    color: Colors.grey.shade600,
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class DemoModeIndicator extends StatelessWidget {
  const DemoModeIndicator({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (!ServiceFactory.isDemoMode()) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.orange.shade100,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange.shade300),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.science,
            size: 16,
            color: Colors.orange.shade700,
          ),
          const SizedBox(width: 4),
          Text(
            'DEMO',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.orange.shade700,
            ),
          ),
        ],
      ),
    );
  }
}
