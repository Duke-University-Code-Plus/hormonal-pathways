function plotStudyResults(Xhist, Shist, Chist, Whist, Wcuml)
    
    figure(1)
    clf
    [nx, ny, nz] = size(Xhist);
    Xmean = zeros(nx,ny);
    Xstd = zeros(nx,ny);
    for i = 1:nx
        for j= 1:ny
            Xmean(i,j) = sum(Xhist(i,j,:))/nz;
            Xstd(i,j) = std(Xhist(i,j,:));
        end % for
    end % for
    errorbar(1:ny,Xmean(1,:),Xstd(1,:))
    hold on
    for i = 2:nx
        errorbar(1:ny,Xmean(i,:),Xstd(i,:),'Color',rand(3,1),'LineWidth',2)
    end % for
    title('Energy History','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(2)
    clf
    [nx, ny, nz] = size(Shist);
    Smean = zeros(nx,ny);
    Sstd = zeros(nx,ny);
    for i = 1:nx
        for j= 1:ny
            Smean(i,j) = sum(Shist(i,j,:))/nz;
            Sstd(i,j) = std(Shist(i,j,:));
        end % for
    end % for
    errorbar(1:ny,Smean(1,:),Sstd(1,:))
    hold on
    for i = 2:nx
        errorbar(1:ny,Smean(i,:),Sstd(i,:),'Color',rand(3,1),'LineWidth',2)
    end % for
    title('Sensitivity History','FontSize',20,'FontName','Arial','FontWeight','bold')
    legend('S1', 'S2', 'S3','FontSize',14)
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(3)
    clf
    [nx, ny, nz] = size(Chist);
    Cmean = zeros(nx,ny);
    Cstd = zeros(nx,ny);
    for i = 1:nx
        for j= 1:ny
            Cmean(i,j) = sum(Chist(i,j,:))/nz;
            Cstd(i,j) = std(Chist(i,j,:));
        end % for
    end % for
    errorbar(1:ny,Cmean(1,:),Cstd(1,:))
    hold on
    for i = 2:nx
        errorbar(1:ny,Cmean(i,:),Cstd(i,:),'Color',rand(3,1),'LineWidth',2)
    end % for
    title('Circulating Level History','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(4)
    clf
    [nx, ny, nz] = size(Whist);
    Wmean = zeros(nx,ny);
    Wstd = zeros(nx,ny);
    for i = 1:nx
        for j= 1:ny
            Wmean(i,j) = sum(Whist(i,j,:))/nz;
            Wstd(i,j) = std(Whist(i,j,:));
        end % for
    end % for
    errorbar(1:ny,Wmean(1,:),Wstd(1,:))
    hold on
    for i = 2:nx
        errorbar(1:ny,Wmean(i,:),Wstd(i,:),'Color',rand(3,1),'LineWidth',2)
    end % for
    title('Fitness History','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(5)
    clf
    [nx, ny, nz] = size(Wcuml);
    Wmean = zeros(nx,ny);
    Wstd = zeros(nx,ny);
    for i = 1:nx
        for j= 1:ny
            Wmean(i,j) = sum(Wcuml(i,j,:))/nz;
            Wstd(i,j) = std(Wcuml(i,j,:));
        end % for
    end % for
    errorbar(1:ny,Wmean(1,:),Wstd(1,:))
    hold on
    for i = 2:nx
        errorbar(1:ny,Wmean(i,:),Wstd(i,:),'Color',rand(3,1),'LineWidth',2)
    end % for
    title('Accumulated Fitness','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    redColor = [1 0 0];
    greenColor = [0 0 1];

    figure(6)
    clf
    hold on
    [nx, ny, nz] = size(Xhist);
    for i = 1:nz
        val = (i-1)/nz;
        plot(1:ny,Xhist(1,:,i),'Color',redColor*(1-val) + greenColor*(val),'LineWidth',2)
    end % for
    title('Energy Histories','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(7)
    clf
    hold on
    [nx, ny, nz] = size(Shist);
    for i = 1:nz
        val = (i-1)/nz;
        plot(1:ny,Shist(1,:,i),'Color',redColor*(1-val) + greenColor*(val),'LineWidth',2)
    end % for
    title('Sensitivity Histories (S1)','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(8)
    clf
    hold on
    [nx, ny, nz] = size(Chist);
    for i = 1:nz
        val = (i-1)/nz;
        plot(1:ny,Chist(1,:,i),'Color',redColor*(1-val) + greenColor*(val),'LineWidth',2)
    end % for
    title('Circulating level histories','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(9)
    clf
    hold on
    [nx, ny, nz] = size(Whist);
    for i = 1:nz
        val = (i-1)/nz;
        plot(1:ny,Whist(1,:,i),'Color',redColor*(1-val) + greenColor*(val),'LineWidth',2)
    end % for
    title('Fitness Histories','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
    
    figure(10)
    clf
    hold on
    [nx, ny, nz] = size(Wcuml);
    for i = 1:nz
        val = (i-1)/nz;
        plot(1:ny,Wcuml(1,:,i),'Color',redColor*(1-val) + greenColor*(val),'LineWidth',2)
    end % for
    title('Accumulated Fitnesses','FontSize',20,'FontName','Arial','FontWeight','bold')
    set(gca(),'FontName','Arial','FontWeight','bold','FontSize',24)
    set(gcf(),'Units','inches','OuterPosition',[1,1,14,9])
end % function