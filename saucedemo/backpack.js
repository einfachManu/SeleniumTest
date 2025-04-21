const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function helloSelenium({ item }) {

  const options = new chrome.Options();
  options.addArguments(
    '--disable-save-password-bubble',
    '--disable-blink-features=Autofill,PasswordGeneration',
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-infobars',
    '--user-agent=MeinCustomUserAgent/1.0'
  );
  options.setUserPreferences({
    'credentials_enable_service': false,
    'profile.password_manager_enabled': false,
    'profile.password_manager_leak_detection': false
  });

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.sendDevToolsCommand('Network.enable', {});
  await driver.sendDevToolsCommand('Network.setExtraHTTPHeaders', {
    headers: {
      'User-Agent': 'MeinCustomUserAgent/1.0',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'upgrade-insecure-requests': '1'
    }
  });

  await driver.get('https://www.saucedemo.com/');
  await driver.manage().setTimeouts({ implicit: 10000 });

  await driver.findElement(By.id('user-name')).sendKeys('standard_user');
  await driver.findElement(By.id('password')).sendKeys('secret_sauce');
  await driver.findElement(By.id('login-button')).click();

  await driver.findElement(By.id(item)).click();
  await driver.findElement(By.className('shopping_cart_link')).click();
  await driver.findElement(By.name('checkout')).click();

  await driver.findElement(By.id('first-name')).sendKeys('John');
  await driver.findElement(By.id('last-name')).sendKeys('Doe');
  await driver.findElement(By.id('postal-code')).sendKeys('12345');
  await driver.findElement(By.name('continue')).click();

  const title = await driver.findElement(By.className('title')).getText();
  console.log(title);

}

helloSelenium({ item: 'add-to-cart-sauce-labs-bike-light' })
  .then(() => console.log('Test completed successfully'))
  .catch(err => console.error('Test failed:', err));
