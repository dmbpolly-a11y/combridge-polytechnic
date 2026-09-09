<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            // Lecture Rooms
            [
                'name' => 'Lecture Room 1',
                'room_number' => 'LR-101',
                'building' => 'Main Block',
                'floor' => 1,
                'capacity' => 50,
                'room_type' => 'lecture_room',
                'facilities' => 'Projector, Whiteboard, Audio System',
                'status' => 'available',
            ],
            [
                'name' => 'Lecture Room 2',
                'room_number' => 'LR-102',
                'building' => 'Main Block',
                'floor' => 1,
                'capacity' => 45,
                'room_type' => 'lecture_room',
                'facilities' => 'Projector, Whiteboard',
                'status' => 'available',
            ],
            [
                'name' => 'Lecture Room 3',
                'room_number' => 'LR-201',
                'building' => 'Main Block',
                'floor' => 2,
                'capacity' => 60,
                'room_type' => 'lecture_room',
                'facilities' => 'Smart Board, Projector, Audio System',
                'status' => 'available',
            ],
            [
                'name' => 'Lecture Room 4',
                'room_number' => 'LR-202',
                'building' => 'Main Block',
                'floor' => 2,
                'capacity' => 55,
                'room_type' => 'lecture_room',
                'facilities' => 'Projector, Whiteboard, AC',
                'status' => 'available',
            ],
            
            // Computer Labs
            [
                'name' => 'Computer Lab 1',
                'room_number' => 'CL-101',
                'building' => 'IT Block',
                'floor' => 1,
                'capacity' => 40,
                'room_type' => 'computer_lab',
                'facilities' => '40 Computers, Projector, AC, High-Speed Internet',
                'status' => 'available',
            ],
            [
                'name' => 'Computer Lab 2',
                'room_number' => 'CL-102',
                'building' => 'IT Block',
                'floor' => 1,
                'capacity' => 35,
                'room_type' => 'computer_lab',
                'facilities' => '35 Computers, Projector, Internet',
                'status' => 'available',
            ],
            [
                'name' => 'Software Development Lab',
                'room_number' => 'CL-201',
                'building' => 'IT Block',
                'floor' => 2,
                'capacity' => 30,
                'room_type' => 'computer_lab',
                'facilities' => '30 High-End PCs, Multiple Screens, Development Tools',
                'status' => 'available',
            ],
            
            // Workshops
            [
                'name' => 'Electrical Workshop',
                'room_number' => 'WS-101',
                'building' => 'Technical Block',
                'floor' => 1,
                'capacity' => 25,
                'room_type' => 'workshop',
                'facilities' => 'Electrical Tools, Test Equipment, Safety Gear',
                'status' => 'available',
            ],
            [
                'name' => 'Automotive Workshop',
                'room_number' => 'WS-102',
                'building' => 'Technical Block',
                'floor' => 1,
                'capacity' => 20,
                'room_type' => 'workshop',
                'facilities' => 'Vehicle Lift, Diagnostic Tools, Hand Tools',
                'status' => 'available',
            ],
            [
                'name' => 'Welding Workshop',
                'room_number' => 'WS-103',
                'building' => 'Technical Block',
                'floor' => 1,
                'capacity' => 15,
                'room_type' => 'workshop',
                'facilities' => 'Welding Machines, Safety Equipment, Ventilation',
                'status' => 'available',
            ],
            
            // Science Labs
            [
                'name' => 'Physics Laboratory',
                'room_number' => 'SL-101',
                'building' => 'Science Block',
                'floor' => 1,
                'capacity' => 30,
                'room_type' => 'laboratory',
                'facilities' => 'Lab Equipment, Experiment Stations, Safety Equipment',
                'status' => 'available',
            ],
            [
                'name' => 'Chemistry Laboratory',
                'room_number' => 'SL-102',
                'building' => 'Science Block',
                'floor' => 1,
                'capacity' => 30,
                'room_type' => 'laboratory',
                'facilities' => 'Fume Hoods, Lab Benches, Chemical Storage, Safety Gear',
                'status' => 'available',
            ],
            
            // Special Rooms
            [
                'name' => 'Library',
                'room_number' => 'LIB-001',
                'building' => 'Administration Block',
                'floor' => 1,
                'capacity' => 100,
                'room_type' => 'library',
                'facilities' => 'Book Shelves, Reading Tables, Computer Stations, WiFi',
                'status' => 'available',
            ],
            [
                'name' => 'Examination Hall',
                'room_number' => 'EH-001',
                'building' => 'Main Block',
                'floor' => 3,
                'capacity' => 150,
                'room_type' => 'examination_hall',
                'facilities' => 'Individual Desks, Proper Spacing, CCTV',
                'status' => 'available',
            ],
            [
                'name' => 'Conference Room',
                'room_number' => 'CR-001',
                'building' => 'Administration Block',
                'floor' => 2,
                'capacity' => 30,
                'room_type' => 'conference_room',
                'facilities' => 'Conference Table, Projector, AC, Video Conferencing',
                'status' => 'available',
            ],
        ];

        foreach ($rooms as &$room) {
            $room['created_at'] = now();
            $room['updated_at'] = now();
        }

        DB::table('rooms')->insert($rooms);
    }
}
