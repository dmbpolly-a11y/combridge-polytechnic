<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Helpers\BrandingHelper;

class BrandingServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register the BrandingHelper as a singleton
        $this->app->singleton('branding', function () {
            return new BrandingHelper();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Share branding data with all views
        View::composer('*', function ($view) {
            $view->with([
                'institutionName' => BrandingHelper::name(),
                'institutionShortName' => BrandingHelper::name(true),
                'tagline' => BrandingHelper::tagline(),
                'motto' => BrandingHelper::motto(),
                'brandColors' => BrandingHelper::get('colors'),
                'contactInfo' => BrandingHelper::contact(),
                'locationInfo' => BrandingHelper::location(),
                'logoPath' => BrandingHelper::logo('path'),
                'badgePath' => BrandingHelper::logo('badge_path'),
            ]);
        });

        // Register custom Blade directives
        $this->registerBladeDirectives();
    }

    /**
     * Register custom Blade directives
     */
    protected function registerBladeDirectives(): void
    {
        // @branding directive
        \Blade::directive('branding', function ($expression) {
            return "<?php echo app('branding')->get({$expression}); ?>";
        });

        // @brandColor directive
        \Blade::directive('brandColor', function ($expression) {
            return "<?php echo app('branding')->color({$expression}); ?>";
        });

        // @formatCurrency directive
        \Blade::directive('formatCurrency', function ($expression) {
            return "<?php echo app('branding')->formatCurrency({$expression}); ?>";
        });

        // @formatDate directive
        \Blade::directive('formatDate', function ($expression) {
            return "<?php echo app('branding')->formatDate({$expression}); ?>";
        });

        // @academicYear directive
        \Blade::directive('academicYear', function ($expression) {
            return "<?php echo app('branding')->academicYear({$expression}); ?>";
        });

        // @grade directive for calculating grade from score
        \Blade::directive('grade', function ($expression) {
            return "<?php echo app('branding')->getGrade({$expression}); ?>";
        });
    }
}
