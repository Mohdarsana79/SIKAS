// Admin Dashboard JavaScript dengan jQuery
$(document).ready(function() {
    console.log('🚀 Main.js loaded');
    
    const $loadingSpinner = $('#loadingSpinner');
    const $sidebar = $('#sidebar');
    const $sidebarToggle = $('#sidebarToggle');
    const $sidebarBackdrop = $('#sidebar-backdrop');

    // Loading Functions
    function showLoading() {
        console.log('🎯 Showing loading spinner');
        if ($loadingSpinner.length) {
            $loadingSpinner.removeClass('hidden');
            $('body').css('overflow', 'hidden');
        }
    }

    function hideLoading() {
        console.log('🎯 Hiding loading spinner');
        if ($loadingSpinner.length) {
            $loadingSpinner.addClass('hidden');
            $('body').css('overflow', '');
        }
    }

    // Sidebar Toggle Functionality
    function toggleSidebar() {
        console.log('🔄 Toggling sidebar with smooth animation');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior dengan animasi
            $sidebar.toggleClass('show');
            $sidebarBackdrop.toggleClass('show');
            $('body').toggleClass('overflow-hidden');
            
            console.log('📱 Mobile sidebar toggled');
        } else {
            // Desktop behavior dengan animasi
            $sidebar.toggleClass('collapsed');
            $('#mainContent').toggleClass('expanded');
            
            // Save state to localStorage
            const isCollapsed = $sidebar.hasClass('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
            
            console.log('💻 Desktop sidebar toggled, saved state:', isCollapsed);
        }
    }

    // Initialize Sidebar State
    function initSidebarState() {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true' && window.innerWidth > 768) {
            $sidebar.addClass('collapsed');
            $('#mainContent').addClass('expanded');
        }
        console.log('🔄 Sidebar initialized:', savedState);
    }

    // Submenu Toggle Functionality
    function initSubmenus() {
        $('[data-toggle="submenu"]').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $this = $(this);
            const targetId = $this.data('target');
            const $target = $('#' + targetId);
            const $arrow = $this.find('.nav-arrow');
            
            console.log('📂 Toggling submenu:', targetId);
            
            // Close other submenus dengan animasi
            $('.nav-submenu').not($target).each(function() {
                const $otherSubmenu = $(this);
                $otherSubmenu.removeClass('show');
                $otherSubmenu.prev().find('.nav-arrow').removeClass('rotated');
            });
            
            // Toggle current submenu dengan animasi
            $target.toggleClass('show');
            $arrow.toggleClass('rotated');
        });
    }

    // Navigation Link Handling
    function initNavigation() {
        $(document).on('click', 'a', function(e) {
            const $link = $(this);
            const href = $link.attr('href');
            
            // Only handle sidebar links
            if (!$link.closest('.sidebar').length) {
                return true;
            }
            
            console.log('🔗 Sidebar link clicked:', href);
            
            // Skip conditions
            if ($link.attr('data-toggle') === 'submenu' || 
                !href || 
                href === '#' || 
                href.startsWith('javascript:') ||
                href === window.location.pathname) {
                console.log('⏩ Skipped navigation');
                return true;
            }

            // Show loading and navigate
            console.log('🎯 Showing loading for navigation');
            showLoading();
            
            // Allow natural navigation
            return true;
        });
    }

    // Mobile Backdrop Click Handler
    function initMobileBackdrop() {
        $sidebarBackdrop.on('click', function() {
            $sidebar.removeClass('show');
            $sidebarBackdrop.removeClass('show');
            $('body').removeClass('overflow-hidden');
        });
    }

    // Window Resize Handler
    function handleResize() {
        if (window.innerWidth > 768) {
            // Desktop: ensure backdrop is hidden
            $sidebarBackdrop.removeClass('show');
            $('body').removeClass('overflow-hidden');
        } else {
            // Mobile: ensure sidebar is hidden by default
            if (!$sidebar.hasClass('show')) {
                $sidebar.removeClass('collapsed');
                $('#mainContent').removeClass('expanded');
            }
        }
    }

    // Active Page Highlighting
    function setActivePage() {
        const currentPath = window.location.pathname;
        console.log('📍 Current path:', currentPath);
        
        // Remove all active states
        $('.nav-link').removeClass('active');
        
        // Find and set active link
        $('.nav-link').each(function() {
            const $link = $(this);
            const linkHref = $link.attr('href');
            
            if (linkHref && linkHref !== '#' && !linkHref.startsWith('javascript:')) {
                if (currentPath === linkHref || currentPath.startsWith(linkHref)) {
                    $link.addClass('active');
                    console.log('🎯 Active page set:', linkHref);
                    
                    // Also activate parent menu if exists
                    const $parentMenu = $link.closest('.nav-submenu');
                    if ($parentMenu.length) {
                        $parentMenu.addClass('show');
                        $parentMenu.prev().find('.nav-arrow').addClass('rotated');
                    }
                }
            }
        });
    }

    // Initialize everything
    function init() {
        console.log('🔄 Initializing application...');
        
        initSidebarState();
        initSubmenus();
        initNavigation();
        initMobileBackdrop();
        setActivePage();
        
        // Event listeners
        $sidebarToggle.on('click', toggleSidebar);
        $(window).on('resize', handleResize);
        
        // Hide loading when page fully loads
        $(window).on('load', function() {
            console.log('📄 Page fully loaded');
            hideLoading();
        });
        
        // Force hide loading after 10 seconds (fallback)
        setTimeout(hideLoading, 10000);
        
        console.log('✅ Application initialized successfully');
    }

    // Start the application
    init();

    // Public API for testing
    window.app = {
        showLoading: showLoading,
        hideLoading: hideLoading,
        toggleSidebar: toggleSidebar,
        testLoading: function() {
            console.log('🧪 Manual test started');
            showLoading();
            setTimeout(() => {
                hideLoading();
                console.log('🧪 Manual test completed');
            }, 3000);
        }
    };
});