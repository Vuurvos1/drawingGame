<script>
    import { onMount } from 'svelte';
    import { locale } from "svelte-i18n";
    import { EnFlag, NlFlag } from "../atoms/custom-icons";

    const languages = [
    {
      name: "English",
      code: "en",
      icon: EnFlag,
    },
    {
      name: "Dutch",
      code: "nl",
      icon: NlFlag,
    },
  ];

  // standard we have a default language
  let currentLanguage = languages.find(lang => lang.code === 'en');

  // check if we have a language in localstorage and if we support it to prevent page errors
  if (localStorage.getItem('language')) {
    const supportedLanguage = languages.find(language => language.code === localStorage.getItem('language'));

    if (supportedLanguage !== undefined) {
      currentLanguage = supportedLanguage
    }
  }

  // update the language html tag
  const handleLanguageChange = (code) => {
    locale.set(code);
    updateActiveLanguage()
  };

  // update the active language
  const updateActiveLanguage = () => {
    let updateLanguage = document.documentElement.lang;
    currentLanguage = languages.find(language => language.code === updateLanguage)

    localStorage.setItem('language', updateLanguage)
  };
</script>

<div class="dropdown">
    <span class="flex items-center p-1 justify-between cursor-pointer">
      { currentLanguage.code.toLocaleUpperCase() }
      <span class="ml-2">
      <svelte:component this={currentLanguage.icon} size="20" class="ml-3"/>
    </span>
    </span>
    <div class="dropdown-content">
      {#each languages as language}
        <p
          value={language.code}
          on:click={(e) =>
            handleLanguageChange(e.target.getAttribute("value"))
          }
          class="flex items-center p-1 justify-between cursor-pointer"
        >
          {language.name}
          <svelte:component this={language.icon} size="20" />
        </p>
      {/each}
    </div>
  </div>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 12px 16px;
    z-index: 1;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
</style>