const Footer = () => {
  return (
    <div className="flex flex-col items-center gap-[130px] text-white p-20 w-full">
      <h1 className="text-4xl font-bold">SOBACCINI</h1>

      <div className="flex flex-col sm:flex-row gap-[145px] justify-between w-max-content gap-28 md:gap-30 lg:gap-34 xl:gap-36">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">89040526523</h1>
          <p className="text-2xl font-light">круглосуточный телефон call-центра</p>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold">О нас</h1>
          <ul className="text-xl font-light gap-3">
            <li>Наши магазины</li>
            <li>Вакансии</li>
            <li>Политика обратботки персональных данных</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold">О нас</h1>
          <ul className="text-xl font-light gap-3">
            <li>Общие контакты</li>
            <li>Отдел маркетинга и рекламы</li>
            <li>Партнерская программа</li>
          </ul>
        </div>
      </div>

    <p className="text-base font-bold">2025 © COPYRIGHT - SOBACCINI</p>
    </div>
  );
};

export default Footer;
