/**
 * English interface text. Every key here must also exist in ar.ts (enforced by TypeScript).
 * Placeholders: {name}. Plurals: "<key>.one" / "<key>.other" (+ zero/two/few/many for Arabic).
 * Product names are NOT translated — they stay exactly as printed on the menu.
 */
export const en = {
  // Global
  'skip': 'Skip to content',
  'lang.toggle': 'عربي',
  'lang.toggleAria': 'التبديل إلى العربية — Switch to Arabic',
  'modal.close': 'Close dialog',

  // Counts
  'items.one': '1 item',
  'items.other': '{count} items',

  // Navigation / header
  'nav.main': 'Main',
  'nav.home': 'Home',
  'nav.menu': 'Full Menu',
  'nav.burgers': 'Burgers',
  'nav.sandwiches': 'Sandwiches',
  'nav.drinks': 'Drinks',
  'nav.branches': 'Branches',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'header.homeAria': 'Meet The Cheese — home',
  'header.selectedBranch': 'Selected branch:',
  'header.changeBranch': 'Change Branch',
  'header.orderingFrom': 'Ordering from {branch}',
  'header.cart': 'Cart',
  'header.openCart': 'Open cart, {items}',

  // Branch picker
  'picker.welcome': 'Welcome to {brand}',
  'picker.subtitle': 'Choose your nearest branch to explore the menu and start your order.',
  'picker.choose': 'Choose This Branch',
  'picker.continue': 'Continue with this branch',
  'picker.current': 'Current branch',
  'picker.keep': 'Keep {branch}',
  'picker.closeAria': 'Close and keep {branch}',
  'picker.saved':
    'Your choice is saved on this device so the menu opens straight away next time. You can change branch at any time from the header.',
  'switch.title': 'Switch to {branch}?',
  'switch.body1': 'Your cart has {items} for {branch}. A cart can only belong to one branch.',
  'switch.body2': 'Switching to {branch} will empty your current cart.',
  'switch.confirm': 'Switch & clear cart',
  'switch.cancel': 'Keep {branch}',

  // Branch details
  'branch.location': 'Location',
  'branch.contact': 'Contact',
  'branch.hours': 'Opening hours',
  'branch.hoursMissing': 'Opening hours not listed — please contact the branch.',
  'phone.phoneWhatsapp': 'Phone / WhatsApp',
  'phone.call': 'Call',
  'phone.whatsapp': 'WhatsApp',
  'phone.callAria': 'Call {number}',
  'phone.whatsappAria': 'Message {number} on WhatsApp (opens WhatsApp)',

  // Hero
  'hero.browsing': 'Now browsing {branch}',
  'hero.line1': 'Big flavour.',
  'hero.line2': 'Extra cheese.',
  'hero.line3': 'Pure cravings.',
  'hero.sub': 'Discover your favourites, explore our menu, and build your order.',
  'hero.explore': 'Explore Menu',
  'hero.viewCart': 'View Your Cart',
  'hero.imageAlt': 'Stacked beef burger with melted cheese pouring over the patties',

  // Category intro
  'cats.eyebrow': 'Explore the menu',
  'cats.title': 'What are you craving?',
  'cats.sub': 'Zinger and smash burgers, toast sandwiches, combo meals, chicken buckets, loaded fries, pasta, shakes and mojitos.',

  // Featured
  'featured.eyebrow': 'Menu highlights',
  'featured.title': 'A taste of the menu',
  'featured.seeAll': 'See the full menu',

  // Menu browser
  'menu.eyebrow': 'Our menu',
  'menu.titleA': 'Pick your',
  'menu.titleB': 'cravings',
  'menu.note': 'Prices in AED as printed on the Meet The Cheese menu. Where the menu prints two prices, choose your option before adding.',
  'menu.categoriesAria': 'Menu categories',
  'menu.all': 'All',
  'menu.searchLabel': 'Search the menu by name',
  'menu.searchPlaceholder': 'Search burgers, shakes…',
  'menu.clearSearch': 'Clear search',
  'menu.results': '{items} found for “{query}”',
  'menu.jumpTo': 'Jump to:',
  'menu.emptyTitle': 'No items found',
  'menu.emptyBody': 'Nothing on the menu matches “{query}”. Try another name.',
  'menu.emptyBodyIn': 'Nothing in {group} matches “{query}”. Try another name.',
  'menu.searchAll': 'Search all categories',

  // Category groups
  'group.burgers': 'Burgers',
  'group.sandwiches': 'Sandwiches & Wraps',
  'group.meals': 'Meals & Combos',
  'group.chicken': 'Chicken',
  'group.sides': 'Appetizerz & Pasta',
  'group.drinks': 'Drinks',
  'group.extras': 'Add Ons & Sauces',

  // Category headings (English keeps the printed headings)
  'cat.zinger-sandwiches': 'Zinger Sandwiches',
  'cat.zinger-burger': 'Zinger Burger',
  'cat.smash-beef-burger': 'Smash Beef Burger',
  'cat.smash-burger': 'Smash Burger',
  'cat.toast-sandwich': 'Toast Sandwich',
  'cat.sandwich': 'Sandwich',
  'cat.wrap': 'Wrap',
  'cat.combo-meals': 'Combo Meals',
  'cat.biggi': 'Biggi',
  'cat.kids-meal': 'Kids Meal',
  'cat.chicken-meal': 'Chicken Meal',
  'cat.chicken-bucket': 'Chicken Bucket',
  'cat.strip-bucket': 'Strip Bucket',
  'cat.appetizerz': 'Appetizerz',
  'cat.pasta': 'Pasta',
  'cat.mojito': 'Mojito',
  'cat.shakes': 'Shakes',
  'cat.smoothies': 'Smoothies',
  'cat.lassi': 'Lassi',
  'cat.add-on': 'Add On',
  'cat.sauce-box': 'Sauce Box',

  // Price options
  'option.regular': 'Regular',
  'option.single': 'Single',
  'option.meal': 'Meal',
  'option.option-1': 'Option 1',
  'option.option-2': 'Option 2',

  // Product card
  'product.priceTbc': 'Price TBC',
  'product.addToCart': 'Add to Cart',
  'product.add': 'Add',
  'product.added': 'Added',
  'product.addAria': 'Add {name} to cart, {price}',
  'product.chooseOption': 'Choose an option for {name}',
  'product.optionAria': 'Option for {name}',
  'product.noPhoto': '{name} — no photo available',
  'product.confirmWithBranch': 'Confirm with branch',
  'product.aboutPrices': 'About these prices',
  'product.askPrice': 'Ask price',
  'product.askPriceAria': 'Ask the branch on WhatsApp for the price of {name}',
  'product.priceNotConfirmed': 'Price not confirmed — please ask the branch.',
  'note.meal':
    'The menu prints two prices. The second is the first + AED 8, matching the menu’s “Add On Meal 8 Aed”, so it is shown as the Meal option. Please confirm with the branch when ordering.',
  'note.unclear': 'The menu prints “{prices}” without saying what each price is for. Please confirm the option with the branch.',
  'note.unconfirmed':
    'This price could not be read reliably from the printed menu, so it can’t be added to the cart. Please ask the branch.',

  // Toasts
  'toast.added': 'Added {name} to your cart',
  'toast.viewCart': 'View cart',
  'toast.removed': 'Removed {name} from your cart',
  'toast.undo': 'Undo',
  'toast.cleared': 'Your cart has been cleared',
  'toast.copied': 'Order copied to clipboard',
  'toast.copyFailed': 'Could not copy automatically — please select the text and copy it.',
  'toast.dismiss': 'Dismiss notification',
  'toast.region': 'Notifications',
  'toast.nowOrdering': 'You’re ordering from {branch}.',
  'toast.switched': 'Cart cleared. You’re now ordering from {branch}.',
  'toast.qrBranch': 'Showing the menu for {branch}.',
  'toast.badBranchLink': 'That branch link wasn’t recognised — please choose your branch.',

  // Cart
  'cart.title': 'Your Cart',
  'cart.close': 'Close cart',
  'cart.orderFor': 'Order for {branch}',
  'cart.change': 'Change',
  'cart.emptyTitle': 'Your cart is empty',
  'cart.emptyBody': 'Burgers, loaded fries, shakes… add your favourites and they’ll show up here.',
  'cart.browse': 'Browse the menu',
  'cart.subtotal': 'Subtotal',
  'cart.pricesNote': 'Menu prices only — no taxes, fees or discounts are added here.',
  'cart.review': 'Review Order',
  'cart.continue': 'Continue browsing',
  'cart.clear': 'Clear cart',
  'cart.clearTitle': 'Clear your cart?',
  'cart.clearBody': 'This removes {items} from your cart. This can’t be undone.',
  'cart.keep': 'Keep items',
  'cart.each': '{price} each',
  'cart.lineTotal': 'Line total',
  'cart.remove': 'Remove {name} from cart',
  'cart.toConfirm': 'Option to confirm',
  'qty.group': 'Quantity of {name}',
  'qty.quantity': 'Quantity',
  'qty.increase': 'Increase quantity of {name}',
  'qty.decrease': 'Decrease quantity of {name}',

  // Order summary
  'summary.back': 'Back to Menu',
  'summary.titleA': 'Order',
  'summary.titleB': 'Summary',
  'summary.emptyTitle': 'Nothing to review yet',
  'summary.emptyBody': 'Your cart is empty. Add a few favourites from the menu, then come back to review and send your order.',
  'summary.stepsAria': 'How ordering works',
  'summary.step1': 'Review your items',
  'summary.step2': 'Send your order on WhatsApp',
  'summary.step3': 'The branch replies to confirm',
  'summary.notice':
    'This website does not take payments and does not send orders by itself. Your order reaches the {branch} only when you send the WhatsApp message, and it is confirmed only when the branch replies.',
  'summary.itemsTitle': 'Your items',
  'summary.caption': 'Items in your order with quantities, unit prices and line totals',
  'summary.colItem': 'Item',
  'summary.colUnit': 'Unit price',
  'summary.colQty': 'Qty',
  'summary.colTotal': 'Line total',
  'summary.pricesNote': 'Menu prices only. No taxes, delivery fees or discounts added.',
  'summary.copy': 'Copy order',
  'summary.copied': 'Copied',
  'summary.clear': 'Clear Cart',
  'summary.orderFor': 'Order for',
  'summary.unclearWarning': 'Some items have two printed prices whose meaning isn’t clear. The branch will confirm them when you send the order.',

  // WhatsApp sending
  'send.title': 'Send your order on WhatsApp',
  'send.body':
    'WhatsApp opens with your full order already typed. Nothing is sent until you press Send in WhatsApp.',
  'send.button': 'Send order on WhatsApp',
  'send.short': 'Send on WhatsApp',
  'send.buttonTo': 'Send to {number}',
  'send.chooseNumber': 'This branch has two WhatsApp numbers. Use either one:',
  'send.opened':
    'WhatsApp opened in a new tab. Check the message and press Send — your order is confirmed only when the branch replies.',
  'send.empty': 'Add items to your cart to send an order.',
  'send.noWhatsapp': 'This branch has no WhatsApp number on file. Please call the branch to order.',
  'send.preview': 'Preview the message',
  'send.fallbackTitle': 'WhatsApp didn’t open',
  'send.fallbackBody':
    'Your browser may have blocked the new tab, or WhatsApp isn’t available on this device. Try the button below, or copy your order and send it to {number} yourself.',
  'send.openLink': 'Open WhatsApp',
  'send.messageLabel': 'Your order message',

  // Branches / contact section
  'branches.eyebrow': 'Branches & contact',
  'branches.title': 'Three branches, one cheesy menu',
  'branches.sub': 'Call or WhatsApp any branch with questions. To order, choose a branch, build your cart and send it on WhatsApp.',
  'branches.orderHere': 'Order from this branch',
  'branches.yours': 'Your branch',

  // Preview banner (demo builds only)
  'demo.banner': 'Preview prepared for Meet The Cheese, not the official website yet.',
  'demo.whatsapp': 'WhatsApp buttons go to the real branch numbers.',

  // Footer
  'footer.tagline': 'Menu and prices as printed on the Meet The Cheese menus. Please confirm with your branch when ordering.',
  'footer.explore': 'Explore',
  'footer.summary': 'Order summary',
  'footer.privacy': 'Privacy',
  'footer.rights': '© {year} Meet The Cheese.',
  'footer.disclaimer': 'No online payments or delivery checkout. You send orders yourself on WhatsApp and the branch confirms them.',

  // Privacy
  'privacy.title': 'Privacy notice',
  'privacy.p1':
    'This website does not ask for your name, address, phone number, email or payment details, and it has no accounts or sign-in.',
  'privacy.p2':
    'To make the menu work, your browser stores three things on this device only (in “local storage”): the branch you chose, the items in your cart, and your language. They are not sent to us or to anyone else. You can remove them at any time by clearing your browser’s site data or by emptying your cart.',
  'privacy.p3':
    'When you press “Send order on WhatsApp”, WhatsApp opens with your order typed in. Nothing is sent until you press Send in WhatsApp. Messages you send are handled by WhatsApp under its own terms and privacy policy, and are read by the branch you sent them to.',
  'privacy.p4': 'This website does not use advertising or analytics trackers.',
  'privacy.clear': 'Clear data stored on this device',
  'privacy.cleared': 'Saved branch, cart and language were removed from this device.',

  // 404
  'nf.title': 'This page melted away',
  'nf.body': 'We couldn’t find what you were looking for. The menu is right where you left it, though.',
  'nf.back': 'Back to Home',
} as const;

export type MessageKey = keyof typeof en;
export type Dictionary = Record<MessageKey, string>;
