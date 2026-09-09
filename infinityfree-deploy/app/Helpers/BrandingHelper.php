<?php

namespace App\Helpers;

class BrandingHelper
{
    /**
     * Get branding configuration
     *
     * @param string|null $key
     * @param mixed $default
     * @return mixed
     */
    public static function get($key = null, $default = null)
    {
        if ($key === null) {
            return config('branding');
        }

        return config("branding.{$key}", $default);
    }

    /**
     * Get institution name
     *
     * @param bool $short
     * @return string
     */
    public static function name($short = false)
    {
        return $short ? self::get('short_name') : self::get('name');
    }

    /**
     * Get brand color
     *
     * @param string $name
     * @return string
     */
    public static function color($name)
    {
        return self::get("colors.{$name}", '#000000');
    }

    /**
     * Get contact information
     *
     * @param string|null $type
     * @return mixed
     */
    public static function contact($type = null)
    {
        if ($type === null) {
            return self::get('contact');
        }

        return self::get("contact.{$type}");
    }

    /**
     * Get location information
     *
     * @param string|null $type
     * @return mixed
     */
    public static function location($type = null)
    {
        if ($type === null) {
            return self::get('location');
        }

        return self::get("location.{$type}");
    }

    /**
     * Get logo path
     *
     * @param string $type
     * @return string
     */
    public static function logo($type = 'path')
    {
        return self::get("logo.{$type}");
    }

    /**
     * Get vision statement
     *
     * @return string
     */
    public static function vision()
    {
        return self::get('vision');
    }

    /**
     * Get mission statement
     *
     * @return string
     */
    public static function mission()
    {
        return self::get('mission');
    }

    /**
     * Get core values
     *
     * @return array
     */
    public static function coreValues()
    {
        return self::get('core_values', []);
    }

    /**
     * Get strategic goals
     *
     * @return array
     */
    public static function strategicGoals()
    {
        return self::get('strategic_goals', []);
    }

    /**
     * Get tagline
     *
     * @return string
     */
    public static function tagline()
    {
        return self::get('tagline');
    }

    /**
     * Get motto
     *
     * @return string
     */
    public static function motto()
    {
        return self::get('motto');
    }

    /**
     * Check if feature is enabled
     *
     * @param string $feature
     * @return bool
     */
    public static function featureEnabled($feature)
    {
        return self::get("features.{$feature}", false);
    }

    /**
     * Get academic year format
     *
     * @param int|null $year
     * @return string
     */
    public static function academicYear($year = null)
    {
        $year = $year ?? date('Y');
        $format = self::get('academic.academic_year_format');

        if ($format === 'Y/Y+1') {
            return $year . '/' . ($year + 1);
        }

        return $year;
    }

    /**
     * Get grading system
     *
     * @return array
     */
    public static function gradingSystem()
    {
        return self::get('academic.grading_system', []);
    }

    /**
     * Get grade for score
     *
     * @param float $score
     * @return string
     */
    public static function getGrade($score)
    {
        $gradingSystem = self::gradingSystem();

        foreach ($gradingSystem as $grade => $range) {
            if ($score >= $range['min'] && $score <= $range['max']) {
                return $grade;
            }
        }

        return 'F';
    }

    /**
     * Get GPA for score
     *
     * @param float $score
     * @return float
     */
    public static function getGPA($score)
    {
        $gradingSystem = self::gradingSystem();
        $grade = self::getGrade($score);

        return $gradingSystem[$grade]['gpa'] ?? 0.0;
    }

    /**
     * Format currency
     *
     * @param float $amount
     * @return string
     */
    public static function formatCurrency($amount)
    {
        $currency = self::get('system.currency', 'UGX');
        return number_format($amount, 0) . ' ' . $currency;
    }

    /**
     * Format date
     *
     * @param string $date
     * @return string
     */
    public static function formatDate($date)
    {
        $format = self::get('system.date_format', 'd/m/Y');
        return date($format, strtotime($date));
    }

    /**
     * Format time
     *
     * @param string $time
     * @return string
     */
    public static function formatTime($time)
    {
        $format = self::get('system.time_format', 'H:i');
        return date($format, strtotime($time));
    }

    /**
     * Format datetime
     *
     * @param string $datetime
     * @return string
     */
    public static function formatDateTime($datetime)
    {
        return self::formatDate($datetime) . ' ' . self::formatTime($datetime);
    }

    /**
     * Get full address
     *
     * @return string
     */
    public static function fullAddress()
    {
        return self::location('full_address');
    }

    /**
     * Get primary phone
     *
     * @return string
     */
    public static function primaryPhone()
    {
        $phones = self::contact('phone');
        return is_array($phones) ? $phones[0] : $phones;
    }

    /**
     * Get all phones
     *
     * @return array
     */
    public static function phones()
    {
        $phones = self::contact('phone');
        return is_array($phones) ? $phones : [$phones];
    }

    /**
     * Get email
     *
     * @return string
     */
    public static function email()
    {
        return self::contact('email');
    }

    /**
     * Get WhatsApp number
     *
     * @return string
     */
    public static function whatsapp()
    {
        return self::contact('whatsapp');
    }

    /**
     * Get portal configuration
     *
     * @param string $portal
     * @param string|null $key
     * @return mixed
     */
    public static function portal($portal, $key = null)
    {
        if ($key === null) {
            return self::get("portals.{$portal}");
        }

        return self::get("portals.{$portal}.{$key}");
    }

    /**
     * Check if portal is enabled
     *
     * @param string $portal
     * @return bool
     */
    public static function portalEnabled($portal)
    {
        return self::portal($portal, 'enabled') ?? false;
    }

    /**
     * Get CSS color variable
     *
     * @param string $name
     * @return string
     */
    public static function cssVar($name)
    {
        $color = self::color($name);
        return "var(--{$name}, {$color})";
    }

    /**
     * Generate inline style for color
     *
     * @param string $property
     * @param string $colorName
     * @return string
     */
    public static function inlineStyle($property, $colorName)
    {
        return "{$property}: " . self::color($colorName) . ";";
    }

    /**
     * Get items per page
     *
     * @return int
     */
    public static function itemsPerPage()
    {
        return self::get('system.items_per_page', 20);
    }

    /**
     * Get timezone
     *
     * @return string
     */
    public static function timezone()
    {
        return self::get('system.timezone', 'UTC');
    }
}
