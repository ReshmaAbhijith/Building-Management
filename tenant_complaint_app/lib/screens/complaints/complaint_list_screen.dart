import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/complaint_provider.dart';
import '../../utils/app_colors.dart';
import '../../widgets/complaint_card.dart';
import '../../models/complaint.dart';

class ComplaintListScreen extends StatefulWidget {
  const ComplaintListScreen({super.key});

  @override
  State<ComplaintListScreen> createState() => _ComplaintListScreenState();
}

class _ComplaintListScreenState extends State<ComplaintListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ComplaintProvider>().loadComplaints();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Complaints'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<ComplaintProvider>().loadComplaints();
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Open'),
            Tab(text: 'In Progress'),
            Tab(text: 'Resolved'),
            Tab(text: 'Closed'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[50],
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search complaints...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          context.read<ComplaintProvider>().loadComplaints();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.white,
              ),
              onChanged: (value) {
                if (value.isEmpty) {
                  context.read<ComplaintProvider>().loadComplaints();
                } else {
                  context.read<ComplaintProvider>().searchComplaints(value);
                }
              },
            ),
          ),
          
          // Complaints List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildComplaintsList(null),
                _buildComplaintsList(ComplaintStatus.open),
                _buildComplaintsList(ComplaintStatus.inProgress),
                _buildComplaintsList(ComplaintStatus.resolved),
                _buildComplaintsList(ComplaintStatus.closed),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComplaintsList(ComplaintStatus? status) {
    return Consumer<ComplaintProvider>(
      builder: (context, complaintProvider, child) {
        if (complaintProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (complaintProvider.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: 64,
                  color: AppColors.error,
                ),
                const SizedBox(height: 16),
                Text(
                  'Error loading complaints',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  complaintProvider.error!,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    complaintProvider.loadComplaints();
                  },
                  child: const Text('Retry'),
                ),
              ],
            ),
          );
        }

        List<Complaint> complaints;
        if (status == null) {
          complaints = complaintProvider.complaints;
        } else {
          complaints = complaintProvider.getComplaintsByStatus(status);
        }

        if (complaints.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.assignment_outlined,
                  size: 64,
                  color: AppColors.textHint,
                ),
                const SizedBox(height: 16),
                Text(
                  status == null 
                      ? 'No complaints found'
                      : 'No ${status.name} complaints',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tap the + button to create a new complaint',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textHint,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => complaintProvider.loadComplaints(),
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: complaints.length,
            itemBuilder: (context, index) {
              return ComplaintCard(
                complaint: complaints[index],
                onTap: () {
                  Navigator.of(context).pushNamed(
                    '/complaint-detail',
                    arguments: complaints[index].id,
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}
