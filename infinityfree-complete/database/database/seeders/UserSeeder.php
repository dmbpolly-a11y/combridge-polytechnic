<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Administrator
        $admin = User::updateOrCreate(
            ['email' => 'admin@combridge.edu'],
            [
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'password' => Hash::make('admin123'),
                'phone' => '+256 393 258 879',
                'gender' => 'male',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $adminRole = Role::where('name', 'administrator')->first();
        if ($adminRole && !$admin->roles->contains($adminRole->id)) {
            $admin->roles()->attach($adminRole->id);
        }

        // Create Director
        $director = User::updateOrCreate(
            ['email' => 'director@combridge.edu'],
            [
                'first_name' => 'College',
                'last_name' => 'Director',
                'password' => Hash::make('director123'),
                'phone' => '+256 393 258 879',
                'gender' => 'male',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $directorRole = Role::where('name', 'director')->first();
        if ($directorRole && !$director->roles->contains($directorRole->id)) {
            $director->roles()->attach($directorRole->id);
        }

        // Create Dean
        $dean = User::updateOrCreate(
            ['email' => 'dean@combridge.edu'],
            [
                'first_name' => 'Academic',
                'last_name' => 'Dean',
                'password' => Hash::make('dean123'),
                'phone' => '+256 414 674 018',
                'gender' => 'female',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $deanRole = Role::where('name', 'dean')->first();
        if ($deanRole && !$dean->roles->contains($deanRole->id)) {
            $dean->roles()->attach($deanRole->id);
        }

        // Create Bursar
        $bursar = User::updateOrCreate(
            ['email' => 'bursar@combridge.edu'],
            [
                'first_name' => 'Financial',
                'last_name' => 'Bursar',
                'password' => Hash::make('bursar123'),
                'phone' => '+256 787 803 099',
                'gender' => 'male',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $bursarRole = Role::where('name', 'bursar')->first();
        if ($bursarRole && !$bursar->roles->contains($bursarRole->id)) {
            $bursar->roles()->attach($bursarRole->id);
        }

        // Create Librarian
        $librarian = User::updateOrCreate(
            ['email' => 'librarian@combridge.edu'],
            [
                'first_name' => 'Library',
                'last_name' => 'Manager',
                'password' => Hash::make('librarian123'),
                'phone' => '+256 393 258 879',
                'gender' => 'female',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $librarianRole = Role::where('name', 'librarian')->first();
        if ($librarianRole && !$librarian->roles->contains($librarianRole->id)) {
            $librarian->roles()->attach($librarianRole->id);
        }

        $this->command->info('Default users created successfully!');
        $this->command->info('');
        $this->command->info('Login Credentials:');
        $this->command->info('Administrator: admin@combridge.edu / admin123');
        $this->command->info('Director: director@combridge.edu / director123');
        $this->command->info('Dean: dean@combridge.edu / dean123');
        $this->command->info('Bursar: bursar@combridge.edu / bursar123');
        $this->command->info('Librarian: librarian@combridge.edu / librarian123');
    }
}
