import sys

def main():
    print("Welcome to the CPU Scheduler Simulation!")
    print("Available Scheduling Algorithms:")
    print("1. First-Come, First-Served (FCFS)")
    print("2. Shortest Job First (SJF)")
    print("3. Priority Scheduling")
    print("4. Round Robin (RR)")
    print("5. Priority + Round Robin")
    
    algo_choice = int(input("Select an algorithm (1-5): "))
    
    if algo_choice not in range(1, 6):
        print("Invalid choice. Exiting.")
        sys.exit(1)
    
    num_processes = int(input("Enter the number of processes: "))
    arrival_time_range = (0, 10)  # Example range
    burst_time_range = (1, 10)    # Example range
    priority_range = (1, 5)       # Example range for priority
    time_quantum = None

    if algo_choice == 4 or algo_choice == 5:  # RR or Priority + RR needs time quantum
        time_quantum = int(input("Enter the time quantum: "))

    processes = generate_random_processes(num_processes, arrival_time_range, burst_time_range, priority_range)
    
    if algo_choice == 1:
        scheduled_processes = fcfs_scheduling(processes)
    elif algo_choice == 2:
        scheduled_processes = sjf_scheduling(processes)
    elif algo_choice == 3:
        scheduled_processes = priority_scheduling(processes)
    elif algo_choice == 4:
        scheduled_processes = round_robin_scheduling(processes, time_quantum)
    elif algo_choice == 5:
        scheduled_processes = priority_round_robin_scheduling(processes, time_quantum)
    
    total_simulation_time = max(p.completion_time for p in scheduled_processes)
    visualize_scheduling_2(scheduled_processes, total_simulation_time)

if __name__ == "__main__":
    main()
