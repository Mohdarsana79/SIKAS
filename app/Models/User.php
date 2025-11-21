<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get user initials from name
     */
    public function getInitials(): string
    {
        $name = trim($this->name);
        $initials = '';

        // Split name by spaces and get first letter of each word
        $words = explode(' ', $name);

        foreach ($words as $word) {
            if (!empty(trim($word))) {
                $initials .= strtoupper(substr(trim($word), 0, 1));
            }
        }

        // If no initials found, use first two letters of name
        if (empty($initials) && !empty($name)) {
            $initials = strtoupper(substr($name, 0, 2));
        }

        // Limit to 2 characters maximum
        return substr($initials, 0, 2);
    }

    /**
     * Generate random color based on user ID for avatar background
     */
    public function getAvatarColor(): string
    {
        $colors = [
            '#0d6efd',
            '#6610f2',
            '#6f42c1',
            '#d63384',
            '#dc3545',
            '#fd7e14',
            '#ffc107',
            '#198754',
            '#20c997',
            '#0dcaf0'
        ];

        $index = $this->id % count($colors);
        return $colors[$index];
    }
}
