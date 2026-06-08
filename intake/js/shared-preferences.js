// shared-preferences.js - Auto-loads preferences in forms
(function() {
    'use strict';
    
    const PREFS_KEY = 'sl_user_preferences';
    const DEFAULT_PREFS = {
        fontSize: 16,
        lineSpacing: 1.5,
        highContrast: false
    };
    
    function loadPreferences() {
        try {
            const saved = localStorage.getItem(PREFS_KEY);
            return saved ? JSON.parse(saved) : DEFAULT_PREFS;
        } catch (e) {
            console.error('Could not load preferences:', e);
            return DEFAULT_PREFS;
        }
    }
    
    function savePreferences(prefs) {
        try {
            localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
        } catch (e) {
            console.error('Could not save preferences:', e);
        }
    }
    
    function applyPreferences(prefs) {
        if (prefs.fontSize) {
            document.documentElement.style.setProperty('--user-font-size', `${prefs.fontSize}px`);
            document.body.style.fontSize = `${prefs.fontSize}px`;
        }
        
        if (prefs.lineSpacing) {
            document.documentElement.style.setProperty('--user-line-height', prefs.lineSpacing);
            document.body.style.lineHeight = prefs.lineSpacing;
        }
        
        if (prefs.highContrast) {
            document.body.classList.add('high-contrast-mode');
        } else {
            document.body.classList.remove('high-contrast-mode');
        }
    }
    
    function loadAndApplyPreferences() {
        const prefs = loadPreferences();
        applyPreferences(prefs);
    }
    
    function createPreferencesUI() {
        const button = document.createElement('button');
        button.id = 'preferences-button';
        button.innerHTML = '⚙️ Settings';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 20px;
            background: #0f172a;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-family: 'Inter', sans-serif;
            transition: all 0.2s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#1e293b';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#0f172a';
            button.style.transform = 'scale(1)';
        });
        
        const modal = document.createElement('div');
        modal.id = 'preferences-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            align-items: center;
            justify-content: center;
        `;
        
        const prefs = loadPreferences();
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-top: 4px solid #d4af37;">
                <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #0f172a; font-family: 'Inter', sans-serif;">Accessibility Settings</h2>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151; font-family: 'Inter', sans-serif;">
                        Font Size: <span id="font-size-value">${prefs.fontSize}px</span>
                    </label>
                    <input type="range" id="font-size-slider" min="12" max="24" value="${prefs.fontSize}" 
                           style="width: 100%; height: 8px; border-radius: 5px; background: #d1d5db; outline: none; cursor: pointer; accent-color: #0f172a;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-top: 4px;">
                        <span>12px</span>
                        <span>24px</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151; font-family: 'Inter', sans-serif;">
                        Line Spacing: <span id="line-spacing-value">${prefs.lineSpacing}</span>
                    </label>
                    <input type="range" id="line-spacing-slider" min="1.0" max="2.0" step="0.1" value="${prefs.lineSpacing}"
                           style="width: 100%; height: 8px; border-radius: 5px; background: #d1d5db; outline: none; cursor: pointer; accent-color: #d4af37;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-top: 4px;">
                        <span>1.0</span>
                        <span>2.0</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; cursor: pointer; font-family: 'Inter', sans-serif;">
                        <input type="checkbox" id="high-contrast-toggle" ${prefs.highContrast ? 'checked' : ''}
                               style="width: 20px; height: 20px; margin-right: 10px; cursor: pointer; accent-color: #0f172a;">
                        <span style="font-weight: 600; color: #374151;">High Contrast Mode</span>
                    </label>
                    <p style="margin: 8px 0 0 30px; font-size: 13px; color: #6b7280;">Increases contrast for better visibility</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="reset-prefs-btn" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-family: 'Inter', sans-serif;">
                        Reset to Defaults
                    </button>
                    <button id="close-prefs-btn" style="padding: 10px 20px; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-family: 'Inter', sans-serif;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(button);
        document.body.appendChild(modal);
        
        button.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        document.getElementById('close-prefs-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        fontSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            fontSizeValue.textContent = size + 'px';
            const currentPrefs = loadPreferences();
            currentPrefs.fontSize = size;
            savePreferences(currentPrefs);
            applyPreferences(currentPrefs);
        });
        
        const lineSpacingSlider = document.getElementById('line-spacing-slider');
        const lineSpacingValue = document.getElementById('line-spacing-value');
        lineSpacingSlider.addEventListener('input', (e) => {
            const spacing = parseFloat(e.target.value);
            lineSpacingValue.textContent = spacing.toFixed(1);
            const currentPrefs = loadPreferences();
            currentPrefs.lineSpacing = spacing;
            savePreferences(currentPrefs);
            applyPreferences(currentPrefs);
        });
        
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        highContrastToggle.addEventListener('change', (e) => {
            const currentPrefs = loadPreferences();
            currentPrefs.highContrast = e.target.checked;
            savePreferences(currentPrefs);
            applyPreferences(currentPrefs);
        });
        
        document.getElementById('reset-prefs-btn').addEventListener('click', () => {
            savePreferences(DEFAULT_PREFS);
            applyPreferences(DEFAULT_PREFS);
            fontSizeSlider.value = DEFAULT_PREFS.fontSize;
            fontSizeValue.textContent = DEFAULT_PREFS.fontSize + 'px';
            lineSpacingSlider.value = DEFAULT_PREFS.lineSpacing;
            lineSpacingValue.textContent = DEFAULT_PREFS.lineSpacing.toFixed(1);
            highContrastToggle.checked = DEFAULT_PREFS.highContrast;
        });
        
        const resetBtn = document.getElementById('reset-prefs-btn');
        const closeBtn = document.getElementById('close-prefs-btn');
        
        resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = '#4b5563');
        resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = '#6b7280');
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = '#1e293b');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = '#0f172a');
    }
    
    loadAndApplyPreferences();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadAndApplyPreferences();
            createPreferencesUI();
        });
    } else {
        loadAndApplyPreferences();
        createPreferencesUI();
    }
})();
