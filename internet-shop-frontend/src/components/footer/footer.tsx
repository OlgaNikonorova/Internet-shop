const Footer = () => {
  return (
    <div className="flex flex-col items-center gap-12 text-white p-10">
      <h1 className="text-3xl">SOBACCINI</h1>

      <div className="flex flex-col sm:flex-row justify-between w-1/2">
        <div className="flex flex-col">
          <h1>89040526523</h1>
          <p>круглосуточный телефон call-центра</p>
        </div>

        <div className="flex flex-col">
          <h1>О нас</h1>
          <ul>
            <li>Наши магазины</li>
            <li>Вакансии</li>
            <li>Политика обратботки персональных данных</li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h1>Контакты</h1>
          <ul>
            <li>Общие контакты</li>
            <li>Отдел маркетинга и рекламы</li>
            <li>Партнерская программа</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
